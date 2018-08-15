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
