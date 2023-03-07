#!/bin/bash

# Badge for prettier
NBERR=$(grep -e "^Code style issues" prettier_report.txt | wc -l)
NBWARN=$(grep -e "^WARNING" prettier_report.txt | wc -l)
color=green
status="passed"
if [[ $NBERR > 0 ]]; then
  color=red
  status="failed"
elif [[ $NBWARN > 0 ]]; then
  color=orange
  status="passed with warnings"
fi

npx generated-badges --label "prettier" -s $status -c $color -o badge_prettier.svg

# Badge for eslint
NBERR=$(grep -e "error" lint_ts_report.txt | wc -l)
NBWARN=$(grep -e "warning" lint_ts_report.txt | wc -l)
color=green
status="passed"
if [[ $NBERR > 0 ]]; then
  color=red
  status="failed"
elif [[ $NBWARN > 0 ]]; then
  color=orange
  status="passed with warnings"
fi

npx generated-badges --label "eslint" -s $status -c $color -o badge_eslint.svg

# Badge for unit testing
NBFAILED=$(grep -e "ERROR" test_report.txt | wc -l)
if [[ $NBFAILED > 0 ]]; then
  color=red
  status="failed"
else
  color=green
  status="passed"
fi
npx generated-badges --label "Unit tests" -s $status -c $color -o badge_unit_test.svg
