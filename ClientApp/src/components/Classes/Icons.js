import React, { Component } from 'react';
import "circular-std";

export class Ico_CheckmarkWhite extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="White checkmark" src="./icons/checkmark-white.svg" />
        </span>);
    }
}

export class Ico_QuestionmarkWhite extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="White questionmark" src="./icons/c-question-white.svg" />
        </span>);
    }
}

export class Ico_Facilitation extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Facilitation icon" src="./icons/Fasilitering.svg" />
        </span>);
    }
}

export class Ico_Organization extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Organization icon" src="./icons/Organisering.svg" />
        </span>);
    }
}

export class Ico_Presentation extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Presentation icon" src="./icons/Presentasjon.svg" />
        </span>);
    }
}

export class Ico_SettingsBlue extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Blue settings icon" src="./icons/Settings-gear-blue.svg" />
        </span>);
    }
}

export class Ico_SettingsWhite extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="White settings icon" src="./icons/settings-gear-white.svg" />
        </span>);
    }
}

export class Ico_Loading extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<img {...this.props} alt="Loading circles icon" src="./icons/l-circles.svg" />);
    }
}

export class Ico_Box extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Box" src="./icons/box.svg" />
        </span>);
    }
}

export class Ico_Analytics extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Analytics icon" src="./icons/analytics.svg" />
        </span>);
    }
}

export class Ico_Group151 extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Group icon A" src="./icons/Group 151.svg" />
        </span>);
    }
}

export class Ico_Group152 extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span>
            <img {...this.props} alt="Group icon B" src="./icons/Group 152.svg" />
        </span>);
    }
}

export class Ico extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} alt="Icon" src={`./icons/${this.props.icon}.svg`} /></span>
        );
    }
}

export class IconMain extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} alt="innonor" src="./icons/innonor.png" /></span>
        );
    }
}

export class IconLogo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} draggable={false} alt="product logo" src="./icons/Logo_Transparent.png" /></span>
        );
    }
}

export class IcoBlue extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} alt="Blue icon" style={{ filter: "invert(48%) sepia(50%) saturate(748%) hue-rotate(182deg) brightness(88%) contrast(87%)" }} src={`./icons/${this.props.icon}.svg`} /></span>
        );
    }
}

export class Ico_Text extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} draggable={false} alt="Multiple Choice" src="./icons/Group 222.svg" /></span>
        );
    }
}

export class Ico_MultipleChoice extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} draggable={false} alt="Multiple Choice" src="./icons/MultipleChoice.svg" /></span>
        );
    }
}

export class Ico_Points extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} draggable={false} alt="Points" src="./icons/Points.svg" /> </span>
        );
    }
}

export class Ico_Slider extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span><img {...this.props} draggable={false} alt="Slider" src="./icons/Slider.svg" /> </span>
        );
    }
}