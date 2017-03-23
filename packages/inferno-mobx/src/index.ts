import Provider from './Provider';
import observer, { trackComponents, renderReporter, componentByNodeRegistery, useStaticRendering } from './observer';
import inject from './inject';
import EventEmitter from './EventEmitter';

export default {
	Provider,
	inject,
	connect: observer,
	observer,
	trackComponents,
	renderReporter,
	componentByNodeRegistery,
	useStaticRendering
};

export {
	EventEmitter,
	Provider,
	inject,
	observer,
	observer as connect,
	trackComponents,
	renderReporter,
	componentByNodeRegistery,
	useStaticRendering
}
