import React from 'react';

class ConstructionMenu extends React.Component {
    close = () => {
        this.props && this.props.close && this.props.close();   
    }
}

export default ConstructionMenu;