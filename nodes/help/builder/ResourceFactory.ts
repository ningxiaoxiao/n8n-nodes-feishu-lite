import ResourceBuilder from './ResourceBuilder';
import { ResourceOperations, ResourceOptions } from '../type/IResource';
import ModuleLoadUtils from '../utils/ModuleLoadUtils';

class ResourceFactory {
	static build(basedir: string): ResourceBuilder {
		const resourceBuilder = new ResourceBuilder();
		const resources: ResourceOptions[] = ModuleLoadUtils.loadModules(basedir, 'resource/*.js');
		// 排序
		resources.sort((a, b) => {
			if (!a.order) a.order = 0;
			if (!b.order) b.order = 0;
			return b.order - a.order;
		});
		resources.forEach((resource) => {
			resourceBuilder.addResource(resource);
			const operates: ResourceOperations[] = ModuleLoadUtils.loadModules(
				basedir,
				`resource/${resource.value}/*.js`,
			);
			// 排序
			operates.sort((a, b) => {
				if (!a.order) a.order = 0;
				if (!b.order) b.order = 0;
				return b.order - a.order;
			});
			operates.forEach((operate: ResourceOperations) => {
				// @ts-ignore
				resourceBuilder.addOperate(resource.value, operate);
			});
		});
		return resourceBuilder;
	}
}

export default ResourceFactory;
