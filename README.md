# VACUUM Simulator

VACUUM Simulator lets you tweak autovacuum settings to learn the relationship
between Postgres configuration settings and autovacuum patterns.
It also helps you find better autovacuum settings for the table.

## Deployment

Currently deployed on Netlify with a default deploy option.

- [https://vacuum-simulator.netlify.app/](https://vacuum-simulator.netlify.app/)

### Add a new sample table stats json

Sample table stats json files are located in `/src/sampledata`. You can add a
new sample data over there. The sample data shape is _not the same_ as the one
that you can collect using `/src/sampledata/collector.sql`, but it is the same
as what you can obtain via pganalyze GraphQL.
Notably, `deletes/inserts/updates/hotUpdates` are different as they are using
the diff data (how much it increased from the previous data collection) with the
pganalyze data, while `collector.sql` will be the cumulative value since the
last stats reset.

Once a sample json file is placed, update the following parts so that it can
show up as a new sample table option in the UI:

- `/src/components/VacuumSimulator/index.tsx`
   - `SampleTableName`
   - `getSampleTableStats`

## Development

VACUUM Simulator is a simple React application, so you can use all usual tricks
of React app.

- `npm install` to install all dependencies
- `npm start` to run the app in the development mode
- `npm run build` to build the app for production to the `build` folder

## Acknowledgments

VACUUM Simulator is originally developed by [pganalyze](https://pganalyze.com),
as a part of the [VACUUM Advisor](https://pganalyze.com/postgres-vacuum-advisor)
feature. You can use the VACUUM Simulator in pganalyze too, using your actual
database usage.

Big thanks to pganalyze for letting this project go open source and for
providing reference data from pganalyze's own database as examples.
