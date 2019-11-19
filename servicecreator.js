function createServiceMixin (execlib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry;

  function CommunicationHistoryUsageServiceMixin (prophash) {
    execlib.execSuite.RemoteServiceListenerServiceMixin.checkForImplementation(this);
    this.findRemote(prophash.historydbpath, null, 'History');
  }
  CommunicationHistoryUsageServiceMixin.prototype.destroy = function () {
  };

  CommunicationHistoryUsageServiceMixin.prototype.writeToCommunicationHistory = execSuite.dependentServiceMethod([], ['History'], function (historysink, mailobj, defer) {
    qlib.promise2defer(historysink.call('create', mailobj), defer);
  });
  
  CommunicationHistoryUsageServiceMixin.prototype.readFromCommunicationHistory = execSuite.dependentServiceMethod([], ['History'], function (historysink, queryobj, defer) {
    taskRegistry.run('readFromDataSink', {
      sink: historysink,
      filter: queryobj.filter,
      visiblefields: queryobj.visiblefields,
      limit: queryobj.limit,
      offset: queryobj.offset,
      singleshot: queryobj.singleshot,
      cb: defer.resolve.bind(defer),
      errorcb: defer.reject.bind(defer)
    });
  });

  CommunicationHistoryUsageServiceMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, CommunicationHistoryUsageServiceMixin
      ,'writeToCommunicationHistory'
      ,'readFromCommunicationHistory'
    );
  };

  return CommunicationHistoryUsageServiceMixin;
}
module.exports = createServiceMixin;


