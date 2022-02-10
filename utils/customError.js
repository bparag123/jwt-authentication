class MyErrors extends Error{
    constructor(statusCode, errMsg){
        super();
        this.statusCode = statusCode,
        this.errMsg = errMsg
    }

    static invalid(status, message) {
        return new MyErrors(status, message)
    }
}

module.exports = MyErrors