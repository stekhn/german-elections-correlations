# Correlations for Germany’s 2017 election
The German election 2017 showed a surge in support for the right-wing party AfD. Articles by several newspapers ([SZ](http://www.sueddeutsche.de/politik/bundestagswahl-je-mehr-autos-desto-mehr-stimmen-fuer-die-union-1.3682709), [NZZ](https://www.nzz.ch/international/wie-einkommen-arbeitslosigkeit-und-migration-das-wahlverhalten-mitbestimmen-ld.1318290)) have sparked a debate on whether election results can be explained by demographic and socio-economic factors. Generally speaking, correlation is not causation. However, a strong correlation can indicate a causal link. The small multiples scatter plot shows the strongest correlations between election results and socio-economic indicators for Germany's 299 constituencies.

- **See it live**: https://stekhn.github.io/german-elections-correlations/src/

## Data 
The data for election results and socio-economic indicators comes from the Federal Returning Officer (Bundeswahlleiter). The data has been refined and filtered to .

- [Preliminary election results 2017](https://www.bundeswahlleiter.de/bundestagswahlen/2017/ergebnisse.html)
- [Socio-economic indicators 2017](https://www.bundeswahlleiter.de/bundestagswahlen/2017/strukturdaten.html)
- [Final election results 2013](https://www.bundeswahlleiter.de/bundestagswahlen/2013/ergebnisse.html)
- [Socio-economic indicators 2013](https://www.bundeswahlleiter.de/bundestagswahlen/2013/strukturdaten.html)

## Future ideas
- Make small-multiples sortable, filterable and searchable
- Add switch for older elections (2013)
- Regression lines
- Aggregate average correlation coefficient per party

## Reading list
- Financial Times: [Germany’s election and the trouble with correlation](https://www.ft.com/content/94e3acec-a767-11e7-ab55-27219df83c97)
- Minutephysics: [Correlation can imply causation!](https://www.youtube.com/watch?v=HUti6vGctQM)

## Acknowledgements
- [D3.js](https://d3js.org/) for being the best data to DOM library around.
- [Simple Statistics](https://simplestatistics.org/) for making correlations in JavaScript easy as π.
