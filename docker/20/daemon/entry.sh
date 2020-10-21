#!/bin/bash

PATH="${PATH:-/bin}:/usr/bin"
export PATH

set -euo pipefail
IFS=$'\n\t'

network=$BAN_NETWORK
case "${network}" in
        live|'')
                network='live'
                dirSuffix=''
                ;;
        beta)
                dirSuffix='Beta'
                ;;
        test)
                dirSuffix='Test'
                ;;
esac

nodedir="${HOME}/BananoData${dirSuffix}"
dbFile="${nodedir}/data.ldb"
mkdir -p "${nodedir}"

echo "Config File not found, adding default."
rm -f ${nodedir}/*.json
rm -f ${nodedir}/*.toml
cp "/node/config/config-node.toml" "${nodedir}/config-node.toml"
cp "/node/config/config-rpc.toml" "${nodedir}/config-rpc.toml"
#cp "/node/config/live.json" "${nodedir}/config.json"
rm -f ${nodedir}/logs/*

# Start watching the log file we are going to log output to
#logfile="${nodedir}/nano-docker-output.log"
#tail -F "${logfile}" &

pid=''
firstTimeComplete=''
while true; do
	if [ -n "${firstTimeComplete}" ]; then
		sleep 10
	fi
	firstTimeComplete='true'

	if [ -f "${dbFile}" ]; then
		dbFileSize="$(stat -c %s "${dbFile}" 2>/dev/null)"
		if [ "${dbFileSize}" -gt 21474836480 ]; then
			echo "ERROR: Database size grew above 20GB (size = ${dbFileSize})" >&2

			while [ -n "${pid}" ]; do
				kill "${pid}" >/dev/null 2>/dev/null || :
				if ! kill -0 "${pid}" >/dev/null 2>/dev/null; then
					pid=''
				fi
			done

			banannode --vacuum
		fi
	fi

	if [ -n "${pid}" ]; then
		if ! kill -0 "${pid}" >/dev/null 2>/dev/null; then
			pid=''
		fi
	fi
	if [ -z "${pid}" ]; then
		bananode --daemon &
		pid="$!"
		sleep 5
	fi
done >> "${logfile}" 2>&1
