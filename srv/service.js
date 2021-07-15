/*eslint-env node, es6 */ /*eslint no-console: 0,*/
"use strict";

const { v4: uuidv4 } = require("uuid");

async function _actionAssertCheckCreate(req) {
  const txCds = cds.transaction(req);
  const txThis = this.transaction(req);

  const { Packages } = cds.entities("assert.check");
  var result = "";
  var dbChange;

  try {
    if (req.headers.service === "CDS") {
      // Assert is ignored
      dbChange = await txCds.run(
        INSERT.into(Packages).entries({
          ID: uuidv4(),
          status: "draft",
          name: "AssertTest-Backend",
          description: "Insert new Packages from backend",
        })
      );

      result = "insert done without error. @assert.format not checked";
    } else if (req.headers.service === "THIS") {
      // Assert is correctly intercepted (correct behaviour)
      dbChange = await txThis.run(
        INSERT.into(Packages).entries({
          ID: uuidv4(),
          status: "draft",
          name: "AssertTest-Backend",
          description: "Insert new Packages from backend",
        })
      );

      result = "insert not done. Error @assert.format checked";
    }
  } catch (err) {
    req.reject(err);
  }

  return result;
}

async function _actionAssertCheckUpdate(req) {
  const txCds = cds.transaction(req);
  const txThis = this.transaction(req);

  const { Packages } = cds.entities("assert.check");
  var result = "";
  var dbChange;

  try {
    // --> ASSERT OK BUT RECORD DOESN'T EXIST
    // ------------------------------------------
    if (req.headers.service === "CDS_UPDATE") {
      // Update without exception (correct behaviour about varibale = 0)
      dbChange = await txCds.run(
        UPDATE(Packages)
          .set({
            name: "AssertTestBackend",
          })
          .where({ ID: "078ea5a4-cd71-44aa-be93-85a00e286418" })
      );

      result =
        "record in Packages table doesn't exist. No exception but variable valorized with " + dbChange;
    } else if (req.headers.service === "THIS_UPDATE") {
      // Update with exception - update: record not found
      dbChange = await txThis.run(
        UPDATE(Packages)
          .set({
            name: "AssertTestBackend",
          })
          .where({ ID: "078ea5a4-cd71-44aa-be93-85a00e286418" })
      );

      result =
        "record in Packages table doesn't exist. Catch exception record not found";
    }

    // --> ASSERT WRONG AND RECORD DOESN'T EXIST
    // ------------------------------------------
    if (req.headers.service === "CDS_ASSERT") {
      // Update without exception - no error variable = 0
      dbChange = await txCds.run(
        UPDATE(Packages)
          .set({
            name: "AssertTest-Backend",
          })
          .where({ status: "draft2" })
      );

      result =
        "record in Packages table doesn't exist, assert not checked. No exception but variable valorized with 0";
    } else if (req.headers.service === "THIS_ASSERT") {
      // Update with exception - assert not respected
      dbChange = await txThis.run(
        UPDATE(Packages)
          .set({
            name: "AssertTest-Backend",
          })
          .where({ status: "draft2" })
      );

      result =
        "record in Packages table doesn't exist. Catch exception about assert";
    }

    // --> ASSERT WRONG BUT RECORD EXIST
    // ------------------------------------------
    if (req.headers.service === "CDS_ASSUPD") {
        // Update without exception (correct behaviour about varibale = 0)
        dbChange = await txCds.run(
          UPDATE(Packages)
            .set({
              name: "AssertTest-Backend",
            })
            .where({ ID: "246fe368-2040-11eb-adc1-0242ac120002" })
        );
  
        result =
          "record in Packages table exist. No exception and record is updated with wrong value";
      } else if (req.headers.service === "THIS_ASSUPD") {
        // Update with exception - update: record not found
        dbChange = await txThis.run(
          UPDATE(Packages)
            .set({
              name: "AssertTest-Backend",
            })
            .where({ ID: "246fe368-2040-11eb-adc1-0242ac120002" })
        );
  
        result =
          "record in Packages table exist. Catch exception record not found";
      }    
  } catch (err) {
    req.reject(err);
  }

  return result;
}

async function _actionAssertCheckUnique(req) {
  const txCds = cds.transaction(req);
  const txThis = this.transaction(req);

  const { Packages } = cds.entities("assert.check");
  var result = "";
  var dbChange;

  try {
    if (req.headers.service === "CDS_UNIQUE") {
      // Assert is ignored
      dbChange = await txCds.run(
        INSERT.into(Packages).entries({
          ID: uuidv4(),
          status: "draft",
          name: "AssertTest",
          description: "Insert new Packages from backend",
        })
      );

      result = "Inserted on the first lap, the error was intercepted from the second lap onwards";
    } else if (req.headers.service === "THIS_UNIQUE") {
      // Assert is correctly intercepted (correct behaviour)
      dbChange = await txThis.run(
        INSERT.into(Packages).entries({
          ID: uuidv4(),
          status: "draft",
          name: "AssertTest",
          description: "Insert new Packages from backend",
        })
      );

      result = "Inserted on the first lap, the error was intercepted from the second lap onwards";
    }
  } catch (err) {
    req.reject(err);
  }

  return result;
}

module.exports = cds.service.impl(async function () {
  this.on("actionAssertCheckCreate", _actionAssertCheckCreate);
  this.on("actionAssertCheckUpdate", _actionAssertCheckUpdate);
  this.on("actionAssertCheckUnique", _actionAssertCheckUnique);  
});
