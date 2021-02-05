/**
 * Copyright (c) 2021. Suzhou DHMS Information Technology Co.,Ltd.
 * Author: Hejifei Created:2021/01/12
 */
import React from 'react'
import styles from './index.module.scss'

export const CP_PARAM_SHOW_TYPE_VALUE = 'value'
export const CP_PARAM_SHOW_TYPE_SWITCH = 'switch'

const CpParamView = ({
    title,
    status,
    statusColor,
    params = [],
}) => {
    return <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <div className={styles.statusIcon} style={{backgroundColor: statusColor}}></div>
            <div className={styles.name}>{title}</div>
            <div className={styles.statusText} style={{color: statusColor}}>{status}</div>
        </div>
        <div className={styles.contentWrapper}>
            {
                params.map((param) => {
                    const {
                        metric_no,
                        name,
                        showType = CP_PARAM_SHOW_TYPE_VALUE,
                        shape = 'circle',
                        value,
                        color,
                    } = param
                    const borderRadius = shape === 'circle' ? '50%' : 0
                    return <div
                        key={metric_no}
                        className={styles.paramWrapper}
                    >
                        <div className={styles.name}>
                            {name}
                        </div>
                        <div className={styles.value}>
                            {showType === CP_PARAM_SHOW_TYPE_VALUE
                                ? value
                                : <div
                                    className={styles.statusOut}
                                    style={{borderRadius, borderColor: color}}
                                >
                                    <div
                                        className={styles.statusIn}
                                        style={{borderRadius, backgroundColor: color}}
                                    >
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                })
            }
        </div>
    </div>
    }

export default CpParamView
