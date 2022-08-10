
export const getError = (type: string, message: string) => {
    const errorType = ["BAD_REQUEST", "UNAUTHORIZED", "NOT_FOUND", "FORBIDDEN", "NOT_ACCEPTABLE", "REQUEST_TIMEOUT", "CONFLICT", "GONE", "HTTP_VERSION_NOT_SUPPORTED", "PAYLOAD_TOO_LARGE", "UNSUPPORTED_MEDIA_TYPE", "UNPROCESSABLE_ENTITY", "INTERNAL_SERVER_ERROR", "NOT_IMPLEMENTED", "IM_A_TEAPOT", "METHOD_NOT_ALLOWED", "BAD_GATEWAY", "SERVICE_UNAVAILABLE", "GATEWAY_TIMEOUT", "PRECONDITION_FAILED"]
    const errorStatus = [400, 401, 404, 403, 406, 408, 409, 410, 505, 413, 415, 422, 500, 501, 418, 405, 502, 503, 504, 412]

    let index = errorType.indexOf(type)
    let status = errorStatus[index]

    return {
        status: status,
        message: message,
        error: type
    }

}