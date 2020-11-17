import React, {Component} from "react";
import "circular-std";


export class Ico_CheckMark extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Check mark"
                        src="./icons/checkmark-white.svg" />
                </span>);
    }
}

export class Ico_QuestionMark extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Question mark"
                        src="./icons/c-question-white.svg" />
                </span>);
    }
}

export class Ico_Facilitation extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Facilitation icon"
                        src="./icons/Fasilitering.svg" />
                </span>);
    }
}

export class Ico_Organization extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Organization icon"
                        src="./icons/Organisering.svg" />
                </span>);
    }
}

export class Ico_Presentation extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Presentation icon"
                        src="./icons/Presentasjon.svg" />
                </span>);
    }
}

export class Ico_SettingsBlue extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Blue settings icon"
                        src="./icons/Settings-gear-blue.svg" />
                </span>);
    }
}

export class Ico_SettingsWhite extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="White settings icon"
                        src="./icons/settings-gear-white.svg" />
                </span>);
    }
}

export class Ico_Loading extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<img {...this.props}
                    alt="Loading circles icon"
                    src="./icons/l-circles.svg" />);
    }
}

export class Ico_Box extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Box"
                        src="./icons/box.svg" />
                </span>);
    }
}

export class Ico_Analytic extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Analytic icon"
                        src="./icons/analytics.svg" />
                </span>);
    }
}

export class Ico_Group151 extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Group icon A"
                        src="./icons/Group 151.svg" />
                </span>);
    }
}

export class Ico_Group152 extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (<span>
                    <img {...this.props}
                        alt="Group icon B"
                        src="./icons/Group 152.svg" />
                </span>);
    }
}

export class Ico extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="Icon"
                    src={`./icons/${this.props.icon}.svg`} />
            </span>
        );
    }
}

export class IconMain extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="Innonor"
                    src="./icons/innonor.png" />
            </span>
        );
    }
}

export class IconLogo extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="product logo"
                    draggable={false}
                    src="./icons/Logo_Transparent.png" />
            </span>
        );
    }
}

export class IcoBlue extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="Blue icon"
                    src={`./icons/${this.props.icon}.svg`}
                    style={{
                        filter: "invert(48%) sepia(50%) saturate(748%) hue-rotate(182deg) brightness(88%) contrast(87%)"
                    }} />
            </span>
        );
    }
}

export class Ico_Text extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="Multiple Choice"
                    draggable={false}
                    src="./icons/OpenText.svg" />
            </span>
        );
    }
}

export class Ico_MultipleChoice extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="Multiple Choice"
                    draggable={false
                    }
                    src="./icons/MultipleChoice.svg" />
            </span>
        );
    }
}

export class Ico_Slider extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="Slider"
                    draggable={false}
                    src="./icons/Slider.svg" />
            </span>
        );
    }
}

export class Ico_Points extends Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <span>
                <img {...this.props}
                    alt="Points"
                    draggable={false}
                    src="./icons/Points.svg" />
            </span>
        );
    }
}