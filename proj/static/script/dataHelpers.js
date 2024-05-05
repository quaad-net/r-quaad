
export const origins = {

    //note: html IDs = hlpr-objectName

    USGovDebt: {
        displayName: 'Debt',
        originTable: 'FYGFD',
        source: "Council of Economic Advisers (US), Gross Federal Debt [FYGFD], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/FYGFD, Feb 4, 2024.",
        sourceDisplayName: 'Gross Federal Debt',
        about: "https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/all-chapters.pdf",
        hlprID: 'hlpr-USGovDebt'
    },
    USGovExpenditures:{
        displayName: 'Expenditures',
        originTable: 'W068RC1A027NBEA',
        source: "U.S. Bureau of Economic Analysis, Government total expenditures [W068RC1A027NBEA], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/W068RC1A027NBEA, Feb 4, 2024.",
        sourceDisplayName: "Government total expenditures",
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