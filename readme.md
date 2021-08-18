# Click Game

	A simple game to train on React.

## Requirements

### Powers

* Shield - Prevents the player from penal damage for a set amount of time.

* Double - Provides 2X the score, for a set amount of time.

* Nuke - Kills all targets and removes all powers, when activated.

* Repellent - Prevents the targets from attacking the player, for a set amount of time.

### Features

* Drops - Stop auto-spawning powers. Create them after targets are swatted.

* Probabilities

	* Fertility - Controls, how probable a target could spawn child.

	* Spawn - Controls, how often a target could spawn without a parent.

	* Attack - Controls, how often a target could attack the player.

	* Drop - Controls, how probable a target could drop a power, when swatted.

* Health Bar - Move away from the lives based model to a health-bar.

* Lifespan - Targets to have a lifespan, post which they'll die. Useful in removing targets like spoilers and butterflies. Should include variance.

* Grant bonus score, when the same type of targets are swatted consecutively.

### Misc

* Use two configs, one for dev and another for prod. Use routes to control this.

* Make the config configurable through URL query params.

* Change all new Date() to Date.now().
