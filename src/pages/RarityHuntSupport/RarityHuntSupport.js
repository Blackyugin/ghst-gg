import React, {useContext, useEffect, useState} from 'react';
import { Container, Backdrop, CircularProgress, } from '@material-ui/core';
import {Helmet} from 'react-helmet';
import {useStyles} from './styles';
import thegraph from '../../api/thegraph';
import web3 from '../../api/web3';
import itemUtils from '../../utils/itemUtils';
import commonUtils from '../../utils/commonUtils';
import {SnackbarContext} from '../../contexts/SnackbarContext';

import RHSFields from './components/RHSFields';
import RHSContent from './components/RHSContent';

export default function RarityHuntSupport() {
    const classes = useStyles();
    const { showSnackbar } = useContext(SnackbarContext);
    const [validAddresses, setValidAddresses] = useState(localStorage.getItem('loggedAccounts')?.split(',')|| ['']);

    const [gotchies, setGotchies] = useState([]);
    const [gotchiesFilter, setGotchiesFilter] = useState('withSetsRarityScore');
    const [isGotchiesLoading, setIsGotchiesLoading] = useState(false);

    const [inventory, setInventory] = useState([]);
    const [inventoryFilter, setInventoryFilter] = useState('desc');
    const [isInventoryLoading, setIsInventoryLoading] = useState(false);

    const [isRewardCalculating, setIsRewardCalculating] = useState(false);

    useEffect(()=> {
        if(validAddresses[0].length !== 0) {
            getGotchiesByAddresses(validAddresses);
            getInventoryByAddresses(validAddresses);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getGotchiesByAddresses = (addresses) => {
        setIsGotchiesLoading(true);
        thegraph.getGotchiesByAddresses(addresses).then((response)=>{
            let combinedGotchies = [];

            response.forEach((item)=>{
                combinedGotchies.push(...item.data.user.gotchisOwned);
            });

            setIsGotchiesLoading(false);
            setGotchies(commonUtils.basicSort(combinedGotchies, gotchiesFilter));
        });
    };

    const getInventoryByAddresses = (addresses) => {
        setIsInventoryLoading(true);
        web3.getInventoryByAddresses(addresses).then((response)=>{
            let combinedArray = [];

            for (let i = 0; i < response.length; i++) {
                response[i].items.forEach((item)=> {
                    let index = combinedArray.findIndex(el => el.itemId === item.itemId);
                    let owner = { id: response[i].owner, qty: +item.balance };

                    if(index !== -1){
                        combinedArray[index].qty = +combinedArray[index].qty + +item.balance;
                        combinedArray[index].owners.push(owner);
                    } else {
                        combinedArray.push({
                            itemId: item.itemId,
                            rarity: itemUtils.getItemRarityById(item.itemId),
                            rarityId: itemUtils.getItemRarityId(itemUtils.getItemRarityById(item.itemId)),
                            qty: +item.balance,
                            owners: [owner]
                        });
                    }
                });
            }

            setIsInventoryLoading(false);
            setInventoryFilter('desc');
            setInventory(commonUtils.basicSort(combinedArray, 'rarityId', 'desc'));
        });
    };

    const loadData = async (addresses) => {
        let noDuplicates = !commonUtils.checkArrayForDuplicates(addresses);
        let allValid = addresses.every((address) => web3.isAddressValid(address));

        if(allValid && noDuplicates) {
            setValidAddresses(addresses);
            getGotchiesByAddresses(addresses);
            getInventoryByAddresses(addresses);
            localStorage.setItem('loggedAccounts', addresses);
            showSnackbar('success', 'Leeroy Jenkins!');
        } else {
            showSnackbar('error', 'One or more addresses are not correct or duplicated!');
        }
    };

    const onGotchiesSort = (event) => {
        // TODO: add filter by owner
        setGotchies(commonUtils.basicSort(gotchies, event.target.value));
        setGotchiesFilter(event.target.value);
    };

    const onInventorySort = (event) => {
        if(event.target.value === 'asc') {
            setInventory(commonUtils.basicSort(inventory, 'rarityId', 'asc'));
        } else if(event.target.value === 'desc') {
            setInventory(commonUtils.basicSort(inventory, 'rarityId', 'desc'));
        } else {
            setInventory(commonUtils.basicSort(inventory, event.target.value, 'desc'));
        }
        setInventoryFilter(event.target.value);
    };

    const isDataLoading = () => {
        return isGotchiesLoading || isInventoryLoading || isRewardCalculating;
    };

    return (
        <Container maxWidth='lg' className={classes.container}>
            <Helmet>
                <title>Rarity Hunt Support</title>
            </Helmet>

            <RHSFields loadData={loadData} validAddresses={validAddresses} />

            <RHSContent
                validAddresses={validAddresses}
                gotchies={gotchies}
                gotchiesFilter={gotchiesFilter}
                onGotchiesSort={onGotchiesSort}
                inventory={inventory}
                inventoryFilter={inventoryFilter}
                onInventorySort={onInventorySort}
                setIsRewardCalculating={setIsRewardCalculating}
                isDataLoading={isDataLoading}
            />

            <Backdrop className={classes.backdrop} open={isDataLoading()}>
                <CircularProgress color='primary' />
            </Backdrop>

        </Container>
    );
}
