#!/usr/bin/env bash
set -e

echo "# QA Report for Secure Geospatial Blockchain" > QA_report.md
echo "Generated: $(date)" >> QA_report.md
echo >> QA_report.md

echo "## Backend Tests (pytest + coverage)" >> QA_report.md
pytest --maxfail=1 --disable-warnings -q --json-report --json-report-file=backend_report.json
python3 - <<'PYCODE' >> QA_report.md
import json
r = json.load(open("backend_report.json"))
print(f"- Total tests run: {r['summary']['total']}")
print(f"- Passed: {r['summary']['passed']}")
print(f"- Failed: {r['summary']['failed']}")
print(f"- Errors: {r['summary']['errors']}")
PYCODE
echo >> QA_report.md

echo "## Backend Linting (flake8)" >> QA_report.md
flake8 . --max-line-length=88 --statistics --count | sed 's/^/- /' >> QA_report.md
echo >> QA_report.md

echo "## Frontend Tests (Jest)" >> QA_report.md
(cd frontend && npx jest --coverage --coverageReporters=text-summary) | sed 's/^/    /' >> QA_report.md
echo >> QA_report.md
