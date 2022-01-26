import React from 'react';
import { Tooltip, Typography } from '@mui/material';

import classNames from 'classnames';
import { ERC1155InnerStyles, tooltipStyles, itemStyles, parselStyles } from '../styles';

import itemUtils from '../../../utils/itemUtils';

export default function ParcelGeneric({parcel}) {
    const classes = {
        ...itemStyles(),
        ...ERC1155InnerStyles(),
        ...tooltipStyles(),
        ...parselStyles()
    };

    const size = itemUtils.getParcelSize(parcel.size);

    return (
        <div className={classNames(classes.item, size, classes.parcelCard)}>

            <div className={classes.labels}>

                <Tooltip
                    title='Quantity'
                    classes={{ tooltip: classes.customTooltip }}
                    placement='top'
                    followCursor
                >
                    <div className={classNames(classes.label, classes.labelBalance)}>
                        <Typography variant='subtitle2'>
                            {parcel.balance}
                        </Typography>
                    </div>
                </Tooltip>
            </div>

            <div className={classNames(classes.nameWrapper, 'two-lined')} >
                <Typography className={classNames(classes.name, classes.textHighlight, size)}>
                    {size}
                </Typography>
            </div>

            <div className={classes.size}>
                {itemUtils.getParcelDimmentions(parcel.size)}
            </div>
        </div>
    )
}