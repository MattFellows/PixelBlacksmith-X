import React from 'react';
import ConstructionMenu from './ConstructionMenu';
import './ConstructionMenu.scss';

class ConstructionMenuTwoPart extends ConstructionMenu {
    render() {
        return <div className={'twoPartContainer'}>
                <div className={'twoPartMenu'}>
                    <div className={'topContainer'}>
                        {this.props.topChildren}
                    </div>
                    <div className={'bottomContainer'}>
                        {this.props.bottomChildren}
                    </div>
                </div>
               </div>
    }
}

export default ConstructionMenuTwoPart;