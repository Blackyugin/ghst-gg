import React, { useEffect, useState, useRef } from 'react';
import { CircularProgress, Backdrop, useTheme } from '@material-ui/core';
import Gotchi from '../../components/Gotchi/Gotchi'; 
import thegraph from '../../api/thegraph';
import useStyles from './styles';
// import Pagination from '@material-ui/lab/Pagination';



export default function GhostExplorer() {

    const classes = useStyles();
    const [gotchiesFromGraph, setGotchiesFromGraph] = useState(null);
    const [gotchiesShown, setGotchiesShown] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const [maxGotchiQuantity, setMaxGotchiQuantity] = useState(0);

    // scrolling
    const scrollingContainerRef = useRef();
    const size = useNodeScroll(scrollingContainerRef.current);

    function useNodeScroll() {
        const [scrollDown, setScrollDown] = useState(false);

        useEffect(() => {
            function handleScroll() {
                const node = scrollingContainerRef.current,
                    clientHeight = node.clientHeight,
                    scrollHeight = node.scrollHeight,
                    scrollTop = node.scrollTop,
                    actualBottomScroll = scrollHeight - (clientHeight + scrollTop);
                    if (!actualBottomScroll) setScrollDown(true);
                    else setScrollDown(false);
            }
            
            scrollingContainerRef?.current?.addEventListener("scroll", handleScroll);
            handleScroll();
            return () =>  scrollingContainerRef?.current?.removeEventListener("scroll", handleScroll);
        }, [scrollDown]);

        return scrollDown;
    }

    const getGotchies = async () => {
         await thegraph.getAllGotchies().then((response) => {
            const gotchiesData = response.sort((a,b) => a.id - b.id);
            setGotchiesFromGraph(gotchiesData);
        }).catch((e)=> {
            console.log(e);
        });
    };

    const renderGotchi = (quantity) => {
        console.log(maxGotchiQuantity);
        const l = gotchiesShown.length;
        if(l < maxGotchiQuantity) {
            const gotchiQuantity = l;

            let gotchiCache,
                lastGotchiCached = gotchiQuantity;

            if (lastGotchiCached < maxGotchiQuantity) {
                
                gotchiCache = gotchiesFromGraph.slice(gotchiQuantity, gotchiQuantity+quantity);

                gotchiCache = gotchiCache.map((item) => {
                    return (
                        <div key={item.id} className={classes.item}>
                            <Gotchi
                                gotchi={item}
                                title={item.id}
                                gotchiColor={theme.palette.customColors.gray}
                                narrowed={true}
                            />
                        </div>
                    )
                });

                const newGotchies = [...gotchiesShown, ...gotchiCache];
                
                setGotchiesShown(newGotchies);

                setIsLoading(false);
            }
            
        }
    };

    useEffect(() => {
        getGotchies();
    }, []);

    useEffect(() => {
        if(gotchiesFromGraph) setMaxGotchiQuantity(gotchiesFromGraph.length);
    }, [gotchiesFromGraph]);

    useEffect(() => {
        if(maxGotchiQuantity) renderGotchi(50);
    }, [maxGotchiQuantity]);

    useEffect(() => {
        if(size) {
            renderGotchi(25);
        }
    }, [size]);

    return (
        <>
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color='primary' />
            </Backdrop>
            <div className={classes.root} ref={scrollingContainerRef}>
                {gotchiesShown}
            </div>
            {/* <Pagination count={10} variant="outlined" /> */}
        </>
    );
}
