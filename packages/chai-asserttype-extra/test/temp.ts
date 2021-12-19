/**
 * Created by user on 2018/11/15/015.
 */

import { install } from '../src';
import _chai from 'chai';

//chai.use(ChaiPluginAssertType);
const chai = install(_chai);

chai.expect(1).is.number()
_chai.expect(1.1).integer.finite
