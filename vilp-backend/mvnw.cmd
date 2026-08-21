@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-25.0.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"
call "%~dp0tools\apache-maven-3.9.9\bin\mvn.cmd" %*
