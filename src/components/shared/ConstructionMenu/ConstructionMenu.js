import React from 'react';

class ConstructionMenu extends React.Component {
    close = () => {
        console.log('Close clicked: ', this.props, this.props.close);
        this.props && this.props.close && this.props.close()   
    }
}

export default ConstructionMenu;