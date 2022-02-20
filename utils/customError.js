class MyErrors extends Error{
    constructor(statusCode, errMsg){
        super();
        this.statusCode = statusCode,
        this.errMsg = errMsg
    }

    static invalid({status, message}) {
        return new MyErrors(status, message)
    }

    static notFound({status=404, message}){
        return new MyErrors(status, message)
    }

    static unAuthorized({status=401, message}){
        return new MyErrors(status, message)
    }
}

module.exports = MyErrors