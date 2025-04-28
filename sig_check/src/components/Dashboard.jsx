import {Link} from 'react-router-dom'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AppBlockingIcon from '@mui/icons-material/AppBlocking';
import { SimpleGrid , Box } from "@chakra-ui/react"
// import { DecorativeBox } from "compositions/lib/decorative-box"

export default function Dashboard(){
    return(
        <div className="home-container">
    
                <SimpleGrid minChildWidth={'sm'} gap={'40'}>
                    <Box bg="white">1</Box>
                </SimpleGrid>
            <section className="email-section">
                < MailOutlineIcon />
                <p>12,400</p>
                <p>Emails Sent</p>
            </section>
            <section className="email-section">
                < InsertDriveFileIcon />
                <p>13,00</p>
                <p>Files Recieved</p>
            </section>
            <section className="email-section">
                < HistoryEduIcon />
                <p>15,00</p>
                <p>Signatures Verified</p>
            </section>
            <section className="email-section">
                < AppBlockingIcon />
                <p>13,00</p>
                <p>Files and Emails Blocked</p>
            </section>
           <section>
           </section>
        </div>
    );
};