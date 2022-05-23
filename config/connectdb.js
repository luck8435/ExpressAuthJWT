import mongoose from 'mongoose'

const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbname: "geekshop"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log('connected to db...');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB
