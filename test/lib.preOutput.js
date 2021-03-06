process.env.TEST_MODE = true;
var sut     = require('../').preOutput;
var request = require('mocha-ui-exports-request');
var fittingDef;
var ctx, cloneCtx;

module.exports = {
    "swagger-json-output~preOutput" : {
        "should be a function that names 2 arugment - err, ctx" : function() {
            Should(sut).be.a.Function().have.property("length", 2)
        },
        "when used with ctx._preOutput is null (no handler)" : {
            beforeAll: function(done){
                ctxAndFittingDefGenerator(true);
                ctx.request.headers = {
                    accept:'text/x-inspect'
                };
                ctx.output = 'Hello world.';
                cloneCtx = Object.assign({}, ctx);
                sut(null, ctx);
                done();

            },
            "should not change the context":function(){
                Should(ctx).eql(cloneCtx);
            }
        },
        "when used with ctx._preOutput as a function" : {
            beforeAll: function(done){
                ctxAndFittingDefGenerator(true);
                ctx.request.headers = {
                    accept:'text/x-inspect'
                };
                ctx.output = 'Hello world.';
                ctx._preOutput = preOutput;
                sut(null, ctx);
                done();

            },
            "Should have ctx.output changed":function(){
                Should(ctx.output).eql('context was changed');
            }
        },
        "when used with ctx._preOutput that is not a function" : {
            beforeAll: function(done){
                ctxAndFittingDefGenerator(true);
                ctx.request.headers = {
                    accept:'text/x-inspect'
                };
                ctx.output = 'Hello world.';
                ctx._preOutput = 'Not a function';
                sut(null, ctx);
                done();

            },
            "Should have ctx.output": function (){
                Should(ctx.output).be.an.Object();
            },
            "Should have ctx.output.message": function (){
                Should(ctx.output.message).eql('error invoking _preOutput handler');
            },
            "Should have ctx.output.error": function (){
                Should(ctx.output.error).eql('ctx._preOutput is not a function');
            },
            "Should have ctx.output.stack": function (){
                Should(ctx.output.stack).be.a.String();
            },
            "Should have ctx.statusCode equal 500": function (){
                Should(ctx.statusCode).eql(500);
            }
        }
    }
};


function ctxAndFittingDefGenerator(errStackFlag){
    ctx = {
        error: null,
        headers:{},
        response: {
            getHeader:getHeader,
            setHeader:setHeader,
            headers: {}
        },
        request: {
            swagger:{
                operation:{
                    produces:[
                        'application/json',
                        'text/x-inspect'
                    ]
                }
            }
        },
        statusCode: null,
        input: null,
        output: null,
        _preOutput: null
    };
    fittingDef = {
        includeErrStack: (errStackFlag)? true: false
    }
}

function getHeader(key){
    return ctx.response.headers[key.toLowerCase()];
}

function setHeader(key, value){
    return ctx.response.headers[key.toLowerCase()] = value;
}

function preOutput(err, key){
    return ctx.output = 'context was changed';
}