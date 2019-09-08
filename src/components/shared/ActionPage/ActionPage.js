import React, { Component } from 'react';
import './ActionPage.scss';

class ActionPage extends Component {
    render() {
        return (
            <div className={this.props.redacted ? 'redacted' : ''}>
                <div className='name'>{this.props.redacted ? '???' : this.props.name}</div>
                <div className='row'>
                    <div className='image'>
                        <img alt={`${this.props.name}`} src={`/images/${this.props.image}`} />
                        <div className='count'>{this.props.count}</div>
                    </div>
                    <div className='description'>{this.props.redacted ? '???' : this.props.description}</div>
                </div>
            </div>
        )
    }
}

export default ActionPage
