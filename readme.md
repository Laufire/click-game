# Click Game

	A simple game to train on React.

## Requirements

### Powers

* *none, yet.*

### Features

* Drops - Stop auto-spawning powers. Create them after targets are swatted.

* Probabilities

	* Fertility - Controls, how probable a target could spawn child.

	* Spawn - Controls, how often a target could spawn without a parent.

	* Drop - Controls, how probable a target could drop a power, when swatted.

* Grant bonus score, when the same type of targets are swatted consecutively.

### Misc

* Use two configs, one for dev and another for prod. Use routes to control this.

* Make the config configurable through URL query params.

* Change all new Date() to Date.now().
