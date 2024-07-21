import mongoose from 'mongoose';

export async function connect() {
    try {
        mongoose.connect(`mongodb+srv://zohaibhassan22002:${encodeURIComponent(process.env.DATABASE_PASSWORD)}@cluster0.xzn1q5f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,

        {
            useNewUrlParser: false,
            // useUnifiedTopology: true,

        })

        const connection = mongoose.connection;

        connection.on('connected', () => {
            // console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        
    }


}
