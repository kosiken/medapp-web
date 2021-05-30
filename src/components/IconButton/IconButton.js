import React from 'react'
import classNames from 'classnames';
import styles from './IconButton.module.css'
const IconButton = ({
    children,
    borderless,
    ...props
}) => {
const classes = classNames(styles['icon-button'],{
    [styles.borderless]: borderless
})
    return (
        <span className={classes} {...props}>
            {children}
        </span>
    )
}

export default IconButton
