const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Ledger must be associated with an account"],
        index: true,
        immutable: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required for creating a ledger entry"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Ledger must be associated with transaction"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Types can be either CREDIT or DEBIT"
        },
        required: [true, "Ledger type is required"],
        immutable: true
    }
})

function preventLedgerModification(next) {
    next(new Error("Ledger entries are immutable and cannot be modified or deleted"));
}

// Update operations
ledgerSchema.pre('update', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('replaceOne', preventLedgerModification);

// Delete operations
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findOneAndRemove', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);

// Save protection (prevent editing existing document)
ledgerSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next(new Error("Ledger entries cannot be modified after creation"));
    }
    next();
});

const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports = ledgerModel