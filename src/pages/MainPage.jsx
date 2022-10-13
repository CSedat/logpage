import { useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {UserAuthContext, useContext} from '../contexts/UserAuth'
import { Navigate } from "react-router-dom";

import PDCPage from './PDCPage'
import YKSPage from './YKSPage'
import HourlySlurry from './HourlySlurry'
import LabPage from './LabPage'
import AmbarPump from './AmbarPump'


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div className='' role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
        {value === index && (
            <Box sx={{ width: '100%', height: '100%' }}>
                <Typography component={'span'}>{children}</Typography>
            </Box>
        )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const {user} = useContext(UserAuthContext)

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    const handleChangeIndex = (index) => {
      setValue(index);
    };

    return (
        <div className="transition-all bg-gradient-to-r from-cyan-700 to-blue-900">
            <Box>
                <AppBar position="static">
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        indicatorColor="secondary" 
                        textColor="inherit" 
                        variant="fullWidth" 
                        aria-label="full width tabs example"
                        sx={{ borderRight: 0, borderColor: "divider", height: "100%" }}
                    >
                        {
                            user?.user?.roles.find(e => e === 'pdc') ?
                                <Tab label="Bant Kantarı" key={0} value={0} {...a11yProps(0)} />
                            : <Navigate to={`/`} exact/>
                        }
                        {
                            user?.user?.roles.find(e => e === 'yks') ? 
                                <Tab label="YKS Yer Kantarı" key={1} value={1} {...a11yProps(1)} />
                            : "s"
                        }
                        {
                            user?.user?.roles.find(e => e === 'slurry') ? 
                                <Tab label="Saatlik Şlam" key={2} value={2} {...a11yProps(2)} />
                            : ""
                        }
                        {
                            user?.user?.roles.find(e => e === 'slurry') ? 
                                <Tab label="Şlam Katı Madde Hesap Tablosu" key={3} value={3} {...a11yProps(3)} />
                            : ""
                        }
                        {
                            user?.user?.roles.find(e => e === 'ambar') ? 
                                <Tab label="Ambar Pompa" key={4} value={4} {...a11yProps(4)} />
                            : ""
                        }
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel className=" h-[90.6vh] w-full " value={value} index={0} dir={theme.direction}>
                    <div className=' text-white h-full'>
                        <PDCPage/>
                    </div>
                    </TabPanel>

                    <TabPanel className=" h-[90.6vh] w-full " value={value} index={1} dir={theme.direction}>
                        <div className=' text-white h-full'>
                            <YKSPage/>
                        </div>
                    </TabPanel>

                    <TabPanel className=" h-[90.6vh] w-full " value={value} index={2} dir={theme.direction}>
                        <div className=' text-white h-full'>
                            <HourlySlurry />
                        </div>
                    </TabPanel>

                    <TabPanel className=" h-[90.6vh] w-full " value={value} index={3} dir={theme.direction}>
                        <div className=' text-white h-full'>
                            <LabPage />
                        </div>
                    </TabPanel>

                    <TabPanel className=" h-[90.6vh] w-full " value={value} index={4} dir={theme.direction}>
                        <div className=' text-white h-full'>
                            <AmbarPump />
                        </div>
                    </TabPanel>
                </SwipeableViews>
            </Box>
        </div>
    );
}
