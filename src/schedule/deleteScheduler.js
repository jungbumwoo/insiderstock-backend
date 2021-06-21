import Info from "../models/Info.js";

export const deleteData = async() => {
    console.log("deleteData from deleteScheduler");
    try {
        let today = new Date();
        let dateBefore = new Date(today.setDate(today.getDate() - 5));
        console.log(`dateBefore`, dateBefore);
        console.log(typeof dateBefore);

        await Info.deleteMany({ createdAt: {$lte: dateBefore }}, (err, result) => {
            console.log(result);
        });
        // await Info.find({}).exec((err, infos) => {
        //     let getDateDiff = (infoDate) => {
        //         let timeNow = new Date();
        //         let createAt = infoDate;
        //         let diff = Math.ceil((timeNow.getTime() - createAt.getTime()) / (1000*3600*24))
        //         return diff;
        //     };
        //     let filterOld = infos.filter((item) => {
        //         let dateDiff = getDateDiff(item.createdAt);
        //         return dateDiff > 2;
        //     });

        //     console.log("filterOld[0]");
        //     console.log(filterOld[0]);

        //     const sellData = filterOld.filter(egg => egg.transaction == 'Sell');
        //     console.log("sellData.length");
        //     console.log(sellData.length);
        //     console.log("sellData[0]");
        //     console.log(sellData[0]);

        //     if (sellData.length > 0){
        //         Info.deleteMany(sellData, (err, result) => {
        //             console.log("delete Result");
        //             console.log(result);
        //         });
        //     }
        // })
    } catch(err) {
        console.log("Err at deleteData func.")
        console.log(err);
    }
};

