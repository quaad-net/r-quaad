
export const origins = {

    // note: html tag IDs = hlpr-objectName

    USGovDebt: {
        displayName: 'Debt',
        originTable: 'FYGFD',
        source: "Council of Economic Advisers (US), Gross Federal Debt [FYGFD], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/FYGFD, Feb 4, 2024.",
        sourceDisplayName: 'Gross Federal Debt',
        about: "https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/all-chapters.pdf",
        hlprID: 'hlpr-USGovDebt'
    },
    USGovExpenditures:{
        displayName: 'Expenditures & Receipts',
        originTable: 'gov_current_receipts_and_expenditures',
        source: "U.S. Bureau of Economic Analysis, Table 3.1. Government Current Receipts and Expenditures, https://apps.bea.gov, Feb 4, 2024",
        sourceDisplayName: "Government Current Receipts and Expenditures",
        about: "https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/all-chapters.pdf",
        hlprID: 'hlpr-USGovExpenditures'
    },
    USGovOutlays:{
        displayName: 'Expenditures By Class',
        originTable: 'Treasury_OutlyAgcy',
        source: "Monthly Treasury Statement (MTS), https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/outlays-of-the-u-s-government, Feb 4, 2024",
        sourceDisplayName: 'Monthly Treasury Statement',
        about: '',
        hlprID: 'hlpr-USGovOutlays'
    },
    USGovReceipts: {
        displayName: 'Receipts By Type',
        originTable: 'gov_current_receipts_and_expenditures',
        source: "U.S. Bureau of Economic Analysis, Table 3.1. Government Current Receipts and Expenditures, https://apps.bea.gov, Feb 4, 2024",
        sourceDisplayName: "Government Current Receipts and Expenditures",
        about: "https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/all-chapters.pdf",
        hlprID: 'hlpr-USGovReceipts'
    },
    getOrigin: function(id){
        for(const idx in origins){
            if(origins[idx]['hlprID'] == id){
                const getOrigin = {
                    displayName: origins[idx]['displayName'],
                    originTable: origins[idx]['originTable'],
                    source: origins[idx]['source'],
                    sourceDisplayName: origins[idx]['sourceDisplayName'],
                    about: origins[idx]['about']
                }
                return getOrigin  
            }
        }
    }
}