import React from 'react'
import moment from 'moment'
import classNames from "classnames"
import styles from './MessageBox.module.css'

const MessageBox = ({message}) => {
    const ContainerClasses = classNames(styles.mb, {
        [styles['right-div']]:message.recieved,
        [styles['left-div']]: !message.recieved
    })

    const Classes = classNames(styles.message, {
        [styles['right']]:message.recieved,
        [styles['left']]: !message.recieved
    })
    return (
        <div   className={"flex column " + ContainerClasses}>
        <div className={"gradients message " +Classes}>
            <p style={{
                margin: 0
            }}>
                {message.content}
            </p>
        </div>

        <small style={{color: "#6B779A"}}> {moment(message.time).format("h:mm a")}</small>
        </div>
    )
}

export default MessageBox
