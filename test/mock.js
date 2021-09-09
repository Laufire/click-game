import { secure, values, map, keys } from '@laufire/utils/collection';
import { rndString, rndValues } from '@laufire/utils/random';
import context from '../src/core/context';
import swatEffects from '../src/services/targetManager/swatEffects';

const livesTill = Date.now();
// TODO: Get other properties on config.
const allTargets = map(context.config.targets, (typeConfig) => secure({
	id: rndString(context.config.idLength),
	type: typeConfig.type,
	health: 1,
	score: typeConfig.score,
	livesTill: livesTill,
	damage: 1,
	variance: 0.2,
	prob: {
		attack: 1,
		fertility: 1,
		spawn: 1,
		drop: 1,
	},
	attackedAt: null,
}));
const targets = secure(values(allTargets));
const targetKeys = keys(allTargets);
const withEffect = keys(swatEffects);
const withoutEffect = targetKeys.filter((targetKey) =>
	!withEffect.includes(targetKey));
const getRandomTargets = (count = 1) => rndValues(targets, count);

const Mocks = {
	allTargets,
	withEffect,
	withoutEffect,
	targets,
	getRandomTargets,
};

export default Mocks;
