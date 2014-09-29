// Libs
var should = require('should'),
    sinon = require('sinon'),
    rewire = require('rewire');

var assets = rewire('./scripts/lib/assets');

var mockFs = null;

var fakeFolderPath = '/home/ds/';
assets.__set__('ASSETS_FOLDER_PATH', fakeFolderPath);

describe('read', function() {

  beforeEach(function() {
    mockFs = sinon.mock(require('fs'));
  });

  afterEach(function() {
    mockFs.restore();
  });

  it('shouldReadAnAssetAnCallsACallbackWhenFilesExistsAndIsReadable', function() {
    // given
    var filename= 'toto';
    var expectedPath = fakeFolderPath + filename;

    var content = {
      content: 'blah'
    };

    mockFs.expects('readFile')
          .once()
          .withArgs(expectedPath)
          .callsArgWith(2, null, content);

    // when
    assets.read(filename, function(err, result) {
      // then
      should(err).not.exist;
      should(result).exist;
      result.should.be.eql(content);
      mockFs.verify();
    });
  });

  it('shouldThrowAnExceptionWhenNoFileNameIsGiven', function() {
    // given
    var exceptionCalled = false;

    // when
    try {
      assets.read();
    } catch(e) {
      e.message.should.be.eql('please, provide an asset name to read an asset');
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });

  it('shouldThrowAnExceptionWhenNoResultCallbackIsGiven', function() {
    // given
    var exceptionCalled = false;
    var fileName = 'toto';
    // when
    try {
      assets.read(fileName);
    } catch(e) {
      e.message.should.be.eql('please, provide a callback to do something with read content');
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });

  it('shouldForwardAnErrorWhenFsFailsToReadGivenFile', function() {
    // given
    var filename= 'toto';
    var expectedPath = fakeFolderPath + filename;

    var error = {
      message: 'blah'
    };

    mockFs.expects('readFile')
          .once()
          .withArgs(expectedPath)
          .callsArgWith(2, error, null);

    // when
    assets.read(filename, function(err, result) {
      // then
      should(err).exist;
      should(result).not.exist;
      err.should.be.eql(error);
      mockFs.verify();
    });
  });
});

describe('readSync', function() {

  beforeEach(function() {
    mockFs = sinon.mock(require('fs'));
  });

  afterEach(function() {
    mockFs.restore();
  });

  it('shouldReadAssetAndReturnContentWhenItExists', function() {
    // given
    var filename = 'toto';
    var content =  {
      content: 'blah'
    };

    var expectedPath = fakeFolderPath + filename;

    mockFs.expects('readFileSync')
          .once()
          .withArgs(expectedPath)
          .returns(content);

    // when
    var result = assets.readSync(filename);

    // then
    should(result).exist;
    result.should.be.eql(content);
    mockFs.verify();
  });

  it('shouldForbidEmptyAssetName', function() {
    // given
    var filename = '';
    var exceptionCalled = false;


    // when
    try {
      assets.readSync(fileName);
    } catch(e) {
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });
});

describe('write', function() {

  beforeEach(function() {
    mockFs = sinon.mock(require('fs'));
  });

  afterEach(function() {
    mockFs.restore();
  });

  var fullPath = '/home/ds/groot.json';

  var fileName = 'groot.json';
  var content = {
    IAM: 'groot'
  };

  var path0 = '/';
  var path1 = '/home/';
  var path2 = '/home/ds/';

  it('shouldOverwriteFileWhenAssetAlreadyExists', function() {
    // given
    mockFs.expects('existsSync')
          .withArgs(path0)
          .once()
          .returns(true);
    mockFs.expects('existsSync')
          .withArgs(path1)
          .once()
          .returns(true);

    mockFs.expects('existsSync')
          .withArgs(path2)
          .once()
          .returns(true);

    var callback = function(err) {
      // then
      mockFs.verify();
    };

    mockFs.expects('writeFile')
          .withArgs(fullPath, content, 'utf8',callback)
          .once()
          .callsArgWith(3,null);

    // when
    assets.write(fileName, content, callback);
  });

  it('shouldCreateFolderWhenAssetFolderDoesNotExist', function() {
    // given
    mockFs.expects('existsSync')
          .withArgs(path0)
          .once()
          .returns(true);
    mockFs.expects('existsSync')
          .withArgs(path1)
          .once()
          .returns(true);

    mockFs.expects('existsSync')
          .withArgs(path2)
          .once()
          .returns(false);

    mockFs.expects('mkdirSync')
          .withArgs(path2)
          .once();

    var callback = function(err) {
      // then
      mockFs.verify();
    };

    mockFs.expects('writeFile')
          .withArgs(fullPath, content, 'utf8',callback)
          .once()
          .callsArgWith(3,null);

    // when
    assets.write(fileName, content, callback);
  });

  it('shouldCreateFolderWhenAssetFolderDoesNotExistRecursively', function() {
    // given
    mockFs.expects('existsSync')
          .withArgs(path0)
          .once()
          .returns(false);
    mockFs.expects('existsSync')
          .withArgs(path1)
          .once()
          .returns(false);

    mockFs.expects('existsSync')
          .withArgs(path2)
          .once()
          .returns(false);

    mockFs.expects('mkdirSync')
          .withArgs(path0)
          .once();
    mockFs.expects('mkdirSync')
          .withArgs(path1)
          .once();
    mockFs.expects('mkdirSync')
          .withArgs(path2)
          .once();

    var callback = function(err) {
      // then
      mockFs.verify();
    };

    mockFs.expects('writeFile')
          .withArgs(fullPath, content, 'utf8',callback)
          .once()
          .callsArgWith(3,null);

    // when
    assets.write(fileName, content, callback);
  });

  it('shouldForbidEmptyAssetsName', function() {
    // given
    var exceptionCalled = false;

    // when
    try {
      assets.write('', '', function() {});
    } catch (e) {
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });

  it('shouldForbidEmptyContents', function() {
    // given
    var exceptionCalled = false;

    // when
    try {
      assets.write('blah', '', function() {});
    } catch (e) {
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });

  it('shouldForbidCallsWithoutCallbacks', function () {
    // given
    var exceptionCalled = false;

    // when
    try {
      assets.write('blah', 'bl');
    } catch (e) {
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });

  it('shouldForwardErrorsWhenSomethingGoesWrongDuringAssetWriting', function() {
    // given
    var error = {
      error: 'err'
    };

    mockFs.expects('existsSync')
          .withArgs(path0)
          .once()
          .returns(true);
    mockFs.expects('existsSync')
          .withArgs(path1)
          .once()
          .returns(true);

    mockFs.expects('existsSync')
          .withArgs(path2)
          .once()
          .returns(true);

    var callback = function(err) {
      // then
      should(err).exist;
      err.should.be.eql(error);
      mockFs.verify();
    };

    // when
    mockFs.expects('writeFile')
          .withArgs(fullPath, content, 'utf8',callback)
          .once()
          .callsArgWith(3,error);
  });
});
