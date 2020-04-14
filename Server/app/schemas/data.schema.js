const clientStatusSchema = {
	title: "clientStatus",
	version: 0,
	description: "Describes the statuses a client can have in the system",
	type: "object",
	properties: {
		_id: { type: "string", primary: true },
		statusDescription: { type: "string" },
		isClosedStatus: { type: "boolean", default: false }
	}
}

module.exports = clientStatusSchema