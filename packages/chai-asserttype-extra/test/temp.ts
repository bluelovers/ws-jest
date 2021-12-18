/**
 * Created by user on 2018/11/15/015.
 */

import ChaiPluginAssertType from '../src';
import _chai from 'chai';

//chai.use(ChaiPluginAssertType);
const chai = ChaiPluginAssertType.install(_chai);

chai.expect(1).is.number()
_chai.expect(1.1).integer.finite
