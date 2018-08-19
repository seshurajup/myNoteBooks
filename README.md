## [Statistics Foundations : Part 1](https://www.lynda.com/Business-Skills-tutorials/Statistics-Fundamentals-Part-1-Beginning/427473-2.html)

* **Mean** $\bar{X}$ : Average of all values
* **Medians** : Middle of all values after it sorted
* **Mode** : Frequent element 
* **Range** : Max - Min difference
* **Standard Derivation** $S$: average square difference from mean
    * How far individual points from mean calculated as 1 standard deviation, 2 standard deviations, 3 standard deviations
    * **Empirical rule** / 3 sigma rule / 68-95-99.7 rule means 3 standard deviation rule 
    * For normal distribution, 1 standard deviation covers 68% of data, 2 standard deviations covers 95% data and 3 standard deviations covers 99.7% data
    * if any point cross 3 standard deviations means 0.3% data are outliers in data

```math
    S = \sqrt{\frac{1}{N-1}*\sum{ ({X_i - \bar{X}}})^2 }
```
* **z-score**: 
    * How many standard deviations from mean for a specific point
```math
z = \frac{X - \bar{X}}{S}
```
* **Percentile rank**: 
    * top 1% is same as 99th percentile are same set
  $ \% rank = [{\frac{No-of-values-below-X + 0.5 }{Total no of values}]*100}$
* **Probability**:
    * **Classical Probability**: if all events fair and equal probability i.e coin flip, die 
    * **Empircal Probability**: History of events, but those events are consider in calculating probability. But these events no need to be fair and equal probability
    * **Subjective Probability**: (Opinion based) When historical won't predict the feature events. 