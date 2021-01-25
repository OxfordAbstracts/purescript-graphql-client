
const idType = typeName => ({
  moduleName: `Data.Id.${typeName}`,
  typeName
})

const newCols = {
  event_id: idType('EventId'),
  stage_id: idType('StageId'),
  client_id: idType('ClientId'),
  submission_id: idType('SubmissionId'),
  program_session_id: idType('ProgramSessionId')
}

module.exports =
  {
    Clients: newCols,
    EventsWithArchived: newCols,
    Stages: newCols,
    SubmissionsWithArchived: {
      ...newCols,
      submission_serial_number: idType('SubmissionSerialNumber')
    },
    ProgramSessions: newCols

  }
