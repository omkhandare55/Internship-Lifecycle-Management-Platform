@echo off
:: Maven Wrapper Script for Windows
set MAVEN_WRAPPER_PROPERTIES=.mvn\wrapper\maven-wrapper.properties
for /f "tokens=2 delims==" %%a in ('findstr "distributionUrl" %MAVEN_WRAPPER_PROPERTIES%') do set DISTRIBUTION_URL=%%a
echo Using Maven from: %DISTRIBUTION_URL%
:: For actual use, run: mvn (if Maven is installed globally)
echo "Please ensure Maven 3.9+ is installed or use: docker compose up"
