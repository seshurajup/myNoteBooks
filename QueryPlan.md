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

## [Postgres Query Plan - Part 3](https://www.depesz.com/2013/05/09/explaining-the-unexplainable-part-3/)
* **Function Scan**:
    ```sql
    explain analyze select * from generate_Series(1,10) i where i < 3;
    ------------------------------------------------------------------------------------------------------------------
    Function Scan on generate_series i  (cost=0.00..12.50 rows=333 width=4) (actual time=0.012..0.014 rows=2 loops=1)
        Filter: (i < 3)
        Rows Removed by Filter: 8
    Total runtime: 0.030 ms
    (4 rows)
    ```
    * Return multiple rows or multiple columns
* **Sort Scan**:
    ```sql
    explain analyze select * from pg_class order by relname;
    ---------------------------------------------------------------------------------------------------------------
    Sort  (cost=22.88..23.61 rows=292 width=203) (actual time=0.230..0.253 rows=295 loops=1)
    Sort Key: relname
    Sort Method: quicksort  Memory: 103kB
    ->  Seq Scan on pg_class  (cost=0.00..10.92 rows=292 width=203) (actual time=0.007..0.048 rows=295 loops=1)
    Total runtime: 0.326 ms
    (5 rows)
    ```
    * Sort all records then push first record to client or parent
    * if memory used for sorting would be more than **work_mem**, it will switch to using disk based sorting
        * Sort Method: quicksort, if fit in memory
        * Sort Method: external merge, if not able to fit in memory
        * Sort Method: top-N heapsort, if LIMIT used with order by
* **Limit**:
    * Will stop the sub-operation when it reach the limit
* **HashAggregate**:
    * Sum, Avg, Min, Max, other aggregate functions with Group By
    * HashAggregate does something like this: for every row it gets, it finds GROUP BY “key" (in this case relkind). Then, in hash (associative array, dictionary), puts given row into bucket designated by given key.
    * After all rows have been processed, it scans the hash, and returns single row per each key value, when necessary – doing appropriate calculations (sum, min, avg, and so on).
    * It is important to understand that HashAggregate has to scan all rows before it can return even single row.
    * If plan have both Sort & Aggregate function then it need **2*work_mem**
    * Single query can use many times work_mem, as work_mem is a limit per operation
* **Hash Join / Hash**:
    * It has two sub operations. One of them is always *Hash*, and the other is something else
    * First (the one called by Hash) has to return all rows, which have to be stored in hash, and the other is processed one row at a time, and some rows will get skipped if they don't exist in hash from the other side
    * will use up to work_mem of memory
* **Nested Loop**:
    * Nested Loop runs one side of join, once. Let's name it “A".
    * For every row in “A", it runs second operation (let's name it “B")
    * if “B" didn't return any rows – data from “A" is ignored
    * if “B" did return rows, for every row it returned, new row is returned by Nested Loop, based on current row from A, and current row from B
    * --- There is no Nested Loop Right Join, because Nested Loop always starts with left side as basis to looping. So join that uses RIGHT JOIN, that would use Nested Loop, will get internally transformed to LEFT JOIN so that Nested Loop can work.
* **Merge Join**:
    * if join column on right side is the same as join column on left side:
return new joined row, based on current rows on the right and left sides
get next row from right side (or, if there are no more rows, on left side)
go to step 1
    * if join column on right side is “smaller" than join column on left side:
get next row from right side (if there are no more rows, finish processing)
go to step 1
    * if join column on right side is “larger" than join column on left side:
get next row from left side (if there are no more rows, finish processing)
go to step 1
## [Postgres Query Plan - Part 4](https://www.depesz.com/2013/05/09/explaining-the-unexplainable-part-4/)
* **Unique**:
    * DISTINCT
    * Query will usually be done using HashAggregate.
    * The problem with Unique is that is requires data to be sorted. Not because it needs data in any particular order – but it needs it so that all rows with the same value will be “together".
    * This makes it really cool (when possible to use) because it doesn't use virtually any memory. It just checks if value in previous row is the same as in current, and if yes – discards it. That's all.
    * **Always sort before Unique**
* **Append**:
    * UNION/UNION All
    * UNION ALL - run all plans and results push together
    * UNION - to remove duplicate, it uses HashAggregate
* **HashSetOp**:
    * INTERSECT/EXCEPT
* **GroupAggregate**
    * To work data has to be sorted using whatever column(s) you used for your GROUP BY clause.
* **CTE Scan**:
    * It runs a part of a query, and stores output so that it can be used by other part (or parts) of the query
    * --- CTEs are ran just as specified. So they can be used to circumvent  **some not-so-good optimizations that planner normally can do**.
* **InitPlan**:
    * Initial part of query to execute, which don't have depend on other query parts
* **SubPlan**:
    * SubPlan is called to calculate data from a subquery, that actually does depends on current row.
## [Postgres Query Plan - Part 5](https://www.depesz.com/2013/05/30/explaining-the-unexplainable-part-5/)
* If all rows in have the same some_value – then using (potentially existing) index on column doesn't make sense.
* if column is unique (or almost unique) – usage of index is really good idea.
```sql 
select * from pg_stats where tablename = 'tablename';
```
* **null_frac**: 
    * How many rows contains null value in given column. This is a fraction, so it's value from 0 to 1
* **avg_width**:
    * Average width of data in this column. 
    * Interesting when we use different data types.
* **n_distinct** : 
    * Positive means closer to 1 ( if all have same value )
    * Negative means most of them are unique
* **most_common_vals** :
    * most common values
* **most_common_freqs** :
    * Fraction of most common values in table
* **histogram_bounds** :
    * array of values which divide whole recordset into groups of the same number of rows
* **correlation** :
    * This is interesting statistic
    * it shows whether there is correlation between physical row ordering on disk, and values. This can go from -1 to 1
    * Generally the closer it is to -1/1 – the more correlation there is.
    * High correlation is best for queries
* most_common_elems, most_common_elem_freqs and elem_count_histogram are like most_common_vals, most_common_freqs and histogram_bounds but for non-scalar datatypes 

## [Postgres Tuning](https://www.youtube.com/watch?v=IFIXpm73qtk)
### Posgres.conf
* **max_connections**:
    * It reject connections over this hard limit
    * default 100 connections 
    * --- raise max connections ( each process for each connection) and no of cores too
    * Latency goes high as connections increase
    * Solutions : Lower max_connection, using Poll active 
    * Connections = ( Cores ) / ( % effective utilization connection ) * scale factor 
* **shared_buffers**:
    * shared_buffers = MIN(1/4 of RAM, )
    * effective_cache_size = MIN(3/4th of RAM)
    * based on benchmark
* **work_mem**:
    * Max local process memory used for operations like sort or join in queries
    * it goes high ~ ( max_connections * max nodes query ), better to keep max_connections low and work_mem high for big queries
* **maintence_work_mem**:
    * Vacuum, create index, check FK... 
    * Good to have high value to run vacuum faster
* **min,max_wal_size**:
    * min at least 1G to 50-100GB
    * since it is SSD, its good to have high value
* **stats_temp_directory**:
    * 
* **huge_pages**:
    * 

* **max_worker_processes**:
    * 
* **max_parallel_workers_per_gather**:
    * 
* **max_parallel_workers**:
    * 
* **autovacuum_max_workers**:
    * use more if we have more cores
* **autovacuum_scale_factor**:
    * override on a per-table level 
* **vacuum_cost_limit**:
    * raise vacuum_cost_limit
* **autovacuum_vacuum_cost_delay**:
    * reduce
* **random_page_cost / seq_page_cost**:
    * default values are (4.0 / 1.0)
    * in SSD, both random_page_cost and seq_page_cost are more similar. so its better to keep same cost for both.
    * because of this cost, indexes may mis-utilized
* **effective_io_concurrency**:
    * more than 1, good for ssd
* **default_statistics_target**:
    * increase it for big tables as per table setting. to improve query planing
    * 

* **pg_stat_statements.track = all**:
    * Track statements generated by stored procedures as well
    * CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
    * shared_preload_libraries = 'pg_stat_statements'  pgstattupple
    * SELECT calls, query FROM pg_stat_statements LIMIT 1;
* Tools
    * https://postgresqlco.nf
    * 
* important tracking parameters
    * **SET trace_sort TO on**
    * **SET client_min_messages TO log**
    * **Pg Stat Statements** :
        * CREATE EXTENSION pg_stat_statements**
        * select * from pg_stat_statements order by total_time desc
    * SET enable_nestloop = OFF; 
    * SET enable_seqscan = OFF;
    * SET max_parallel_workers = total cores;
    * SET max_parallel_workers_per_gather = 1/3 of total cores;
    * Extra set parameters from **[Query planning - server configuration](https://www.postgresql.org/docs/10/static/runtime-config-query.html)**
    * EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON) 
    * SELECT * FROM (VALUES (1), (2) ) as temp_table(column_name)
    * **EXPLAIN (ANALYZE, VERBOSE, COSTS, BUFFERS, TIMING, SUMMARY, FORMAT JSON)**
    * **ANALYZE table_name**
        * SELECT * FROM pg_stats WHERE schemaname = 'schemaname' AND tablename = 'tablename' AND attname = 'columnname';
        * Postgres's planner used these statistics to select the appropriate index, join methods for query.
    
##[Estimating Needed Memory for a Sort](https://rjuju.github.io/postgresql/2015/08/18/estimating-needed-memory-for-a-sort.html)
* Best work_memory for existing quries
