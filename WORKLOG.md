# Status

Web:
- local query: works
- remote query: works
- local info: works
- remote info: works
- fetch: works

Emulator:
- local query: [not_found: missing]

- remote query: { status: 0, name: 'unknown', message: undefined }

- local info: { doc_count: 0, update_seq: 0, db_name: 'wodmeup', auto_compaction:false, adapter: 'asyncstorage' }

- remote info:  { status: 0, name: 'unknown', message: undefined }

- fetch: [TypeError: Network request failed]


Findings
- Emulator: Data was NOT REPLICATED.
- Fetching this works! http://facebook.github.io/react-native/movies.json

TODO
[ ] .find isn't working on web. Use indexedDB in web?
[ ] remove utils/data.js



====> Sidetrack
[ ] configurable replication url
