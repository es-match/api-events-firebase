# Programming language

Contents:

* [Summary](#summary)
  * [Issue](#issue)
  * [Decision](#decision)
  * [Status](#status)
* [Details](#details)
  * [Assumptions](#assumptions)
  * [Constraints](#constraints)
  * [Positions](#positions)
  * [Argument](#argument)
  * [Implications](#implications)
* [Related](#related)
  * [Related decisions](#related-decisions)
  * [Related requirements](#related-requirements)
  * [Related artifacts](#related-artifacts)
  * [Related principles](#related-principles)

## Summary


### Issue

We need to choose programming language for our software back end: The programming language suitable for connect mobile application to DB with API system.


### Decision

We are choosing Node.js + Express.


### Status

Decided.


## Details


### Assumptions

The back-end applications are typical:

  * Typical to control de bussiness rules of DB

  * Typical API(s) - Micro-services

The front-end applications is likely to evolve quickly:

  * We want to ensure fast easy developments, deployments, iterations, etc.

  * We need to use the application to validate the MVP.

  * We do not need legacy compatibility.


### Positions

We considered these langauges:

  * Node.js

  * .Net Core

  * C++


### Argument

Summary per language:

  * Node.js easy to implement with javascript base language and High-Performed to assynchronous process.

  * .Net Core have many tools to help developing, but so manual to configure threads.

  * C++ is more relevated to IOT projects.
  


### Implications

Node.js like to be used with Express to enforce the consistence of API(s).


## Related


### Related decisions

The Node.js should be used to develop API(s) in cloud Firebase functions environment


### Related requirements

Firebase account and defined DB.


### Related artifacts

TODO.


### Related principles

Need for speed deploys and corrections.


