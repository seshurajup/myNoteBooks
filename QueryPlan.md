## [Postgres Query Plan - Part 1](https://www.depesz.com/2013/04/16/explaining-the-unexplainable/)

```sql
$ explain select * from test where i = 1;
                      QUERY PLAN                      
------------------------------------------------------
 Seq Scan on test  (cost=0.00..40.00 rows=12 width=4)
   Filter: (i = 1)
(2 rows)
```
* Sequential scan means that PostgreSQL will open the table data, and read it all, potentially filtering (removing) rows, but generally ready to read and return whole table.
* To do seq scan, I just need to read one page (8192 bytes) from table, and I get the row. To use index, I have to read page from index, check it to find if we have row matching condition in the table and then read page from table.
* **Cost**=0.00...40.00: It's unit is fetching single page in sequential manner". It is about time and resource usage.
    * So, the range (number .. number) is because it shows cost for starting the operation row and cost for getting all rows (By all, I mean all returned by this operation, not all in table).
    * ```sql
        UERY PLAN                             
        -------------------------------------------------------------------
        Sort  (cost=22.88..23.61 rows=292 width=202)
            Sort Key: relfilenode
                ->  Seq Scan on pg_class  (cost=0.00..10.92 rows=292 width=202)
                (3 rows)
        ```
    * Startup cost for Sort is 22.88, while total cost is just 23.61. So returning rows from Sort is trivial (in terms of cost), but sorting them – not so much.
* **Rows**=292:
    * How many rows operation extimated & return
    * As joining two tables that have 20 rows together can be done in many ways, and it doesn't really matter how, but when you join 1 million row table with 1 billion row table, the way you do the join is very important
* **Width**=4:
    * How many bytes, on average, there are in single row returned from given operation
* **Tree**: 
    * Dependency graph for query plan. Parent node needs data from child node 
* **actual_time**=0.00...20.00:
    * How much time PostgreSQL actually did spend working on given operation (on average, because it could have run the same operation multiple times). And just as with cost – time is a range. Startup time, and time to return all data
* **loops**=1: 
    * How many times this operation was in total ran
```sql
explain analyze select * from t limit 100;
 Limit  (cost=0.00..9.33 rows=100 width=608) (actual time=0.008..0.152 rows=100 loops=1)
   ->  Seq Scan on t  (cost=0.00..93333.86 rows=999986 width=608) (actual time=0.007..0.133 rows=100 loops=1)
 Total runtime: 0.181 ms
(3 rows)
```
    * As you can see – Limit has startup time of 0.008 (millisecond, that's the unit in here). This is because Seq Scan (which Limit called to get data) took 0.007ms to return first row, and then there was 0.001ms of processing within limit itself.
    * Afterwards (after returning 1st row), limit kept getting data from Seq Scan, until it got 100 rows. Then it terminated Seq scan (which happened 0.133ms after start of query), and it finished after another 0.019 ms.

* **explain**:
    *  shows costs in abstract units, which are based on random-sample estimates
* **explain analyze**:
    *  shows real life times, rowcounts and execution counts, in units that can be compared with different queries.
### Postgresql.conf
* These settings help PostgreSQL to used when plan estimate runs 
```
seq_page_cost = 1.0                    # measured on an arbitrary scale
random_page_cost = 4.0                 # same scale as above
cpu_tuple_cost = 0.01                  # same scale as above
cpu_index_tuple_cost = 0.005           # same scale as above
cpu_operator_cost = 0.0025             # same scale as above
```

## [Postgres Query Plan - Part 2](https://www.depesz.com/2013/04/27/explaining-the-unexplainable-part-2/)
```sql
explain analyze select * from pg_class where relname ~ 'a';  
---------------------------------------------------------------------------------------------------------
 Seq Scan on pg_class  (cost=0.00..11.65 rows=227 width=202) (actual time=0.030..0.294 rows=229 loops=1)
   Filter: (relname ~ 'a'::text)
   Rows Removed by Filter: 66
 Total runtime: 0.379 ms
(4 rows)
```
* **Seq Scan**:
    * Reads rows, one by one, returning them to user or to upper node
    * Order of returned rows is not any specific
    * *Filter rows* – that is reject some from being returned
    * --- : Sequential scan is faster for getting single page, but on the other hand – you not always need all the pages.
* **Index Scan**:
    * opens the index
    * in the index if finds where (in table data) there might be rows that match given condition
    * opens table
    * fetches row(s) pointed to by index
    * if the rows can be returned – i.e. they are visible to current session – they are returned
    * rows which deleted are invisible state in table until vacuumed
    * **Index scan - used when you want some data ordered using order from index**
    * **Index Scan Backward** - used when use order by desc 
    * **Index only Scan** 
        *  Pg realized that I select only data (columns) that are in the index. And it is possible that it doesn't need to check anything in the table files. So that it will return the data straight from index
        *  **Super Fast**
        *  The problem is that, in order to make it work, Index has to contain information that given rows are in pages, that didn't have any changes “recently". This means that in order to utilize Index Only Scans, you have to have your table well vacuumed. But with *autovacuum* running, it shouldn't be that big of a deal.
    * --- : Index Scans (normal) cause random IO – that is, pages from disk are loaded in random fashion. Which, at least on spinning disks, is slow.
* **Bitmap Scan**:
    * Bitmap Scans are always in (at least) two nodes. First (lower level) there is Bitmap Index Scan, and then there is Bitmap Heap Scan
  
    * Let's assume your table has 100000 pages (that would be ~ 780MB). Bitmap Index Scan would create a bitmap where there would be one bit for every page in your table. So in this case, we'd get memory block of 100,000 bits ~ 12.5kB. All these bits would be set to 0. Then Bitmap Index Scan, would set some bits to 1, depending on which page in table might contain row that should be returned.
    * This part doesn't touch table data at all. Just index. After it will be done – that is all pages that might contain row that should be returned will be “marked", this bitmap is passed to upper node – Bitmap Heap Scan, which reads them in more sequential fashion
    * --- : when the rows that you'll be returning are not in single block (which would be the case if I did “… where id < ..."). Bitmap scans have also one more interesting feature. That is - they can join two operations, two indexes ( a < 5 & a > 10 )
    * ```sql
         explain analyze select * from test where i < 5000000 or i > 950000000;
         ------------------------------------------------------------------------------------------------------------------------
        Bitmap Heap Scan on test  (cost=107.36..630.60 rows=5323 width=8) (actual time=1.023..4.353 rows=5386 loops=1)
            Recheck Cond: ((i < 5000000) OR (i > 950000000))
        ->  BitmapOr  (cost=107.36..107.36 rows=5349 width=0) (actual time=0.922..0.922 rows=0 loops=1)
            ->  Bitmap Index Scan on i1  (cost=0.00..12.25 rows=527 width=0) (actual time=0.120..0.120 rows=491 loops=1)
               Index Cond: (i < 5000000)
            ->  Bitmap Index Scan on i1  (cost=0.00..92.46 rows=4822 width=0) (actual time=0.799..0.799 rows=4895 loops=1)
               Index Cond: (i > 950000000)
        Total runtime: 4.765 ms
        (8 rows)

