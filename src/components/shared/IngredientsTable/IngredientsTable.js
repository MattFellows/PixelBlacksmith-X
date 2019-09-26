import React, { Component } from 'react';
import { connect } from 'react-redux';
import './IngredientsTable.scss';

class IngredientsTable extends Component {
    render() {
        return (
            <div className={'ingredientsContainer'}>
                <div className='ingredientsTable'>
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Need</th>
                            <th>Have</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className={'icon'}><img alt='level' src={`/images/levels.png`}/></td>
                            <td className={'name'}>Level</td>
                            <td className='count centered'>{this.props.product.level}</td>
                            <td className='count centered'>{this.props.level}</td>
                        </tr>
                        {this.props.product.ingredients.map(ing => <tr key={ing.name}>
                            <td className={'icon'}>{ing.image && <img alt={'ing.name'} src={`/images/${ing.image}`}/>}</td>
                            <td className={'name'}>{ing.name}</td>
                            <td className='count centered'>{ing.count}</td>
                            <td className='count centered'>{this.props.inventory.find(item => item.name === ing.name).count}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className={'buttonContainer'}>
                    <div onClick={() => {this.props.action(1)}} className={'button'}>{`${this.props.actionName} 1`}</div>
                    <div onClick={() => {this.props.action(10)}} className={'button narrow'}>10</div>
                    <div onClick={() => {this.props.action('max')}} className={'button narrow'}>Max</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    inventory: state.inventory,
})

export default connect(mapStateToProps)(IngredientsTable);
