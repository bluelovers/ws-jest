/**
 * Created by user on 2018/11/15/015.
 */

import ChaiPluginAssertType = require('chai-asserttype-extra');

import _chai = require('chai');

//chai.use(ChaiPluginAssertType);
const chai = ChaiPluginAssertType.install(_chai);

chai.expect(1).not.number()
