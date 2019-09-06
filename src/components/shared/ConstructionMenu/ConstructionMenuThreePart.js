import React from 'react';
import ConstructionMenu from './ConstructionMenu';
import './ConstructionMenu.scss';

class ConstructionMenuThreePart extends ConstructionMenu {
    render() {
        return <div className={'threePartContainer'}>
                <div className={'threePartMenu'}>
                    <div className={'topContainer'}>
                        <div className={'help'}></div>
                        {this.props.topChildren}
                        <div className={'close'} onClick={this.close}></div>
                    </div>
                    <div className={'middleContainer'}>
                        {this.props.middleChildren}
                    </div>
                    <div className={'bottomContainer'}>
                        {this.props.bottomChildren}
                    </div>
                </div>
               </div>
    }
}

export default ConstructionMenuThreePart;