/*
Classes used to store application objects
 */

class Gene {
    Size = 0;
    EntryNumber = 0;

    GeneType = -1;
    GeneSubType = -1;
    GeneId = -1;
    Generation = -1;
    SwitchOnTime = -1;
    Flags = -1;
    MutabilityWeighting = -1;
    ExpressionVariant = -1;

    //Flags
    Mutable = false;
    Duplicable = false;
    Deletable = false;
    MaleOnly = false;
    FemaleOnly = false;
    NotExpressed = false;

    GeneNoteObj = null;

    //Specialization: Organ, Brain Lobe, etc...
    SpecialiazedObj = null;

    Variant = 0; //Don't know where it's coming from...

    constructor(bytes, entry_number) {
        this.EntryNumber = entry_number;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.GeneType = bytes[0];
        this.GeneSubType = bytes[1];
        this.GeneId = bytes[2];
        this.Generation = bytes[3];
        this.SwitchOnTime = bytes[4];
        this.Flags = bytes[5];
        this.readFlags();
        this.MutabilityWeighting = bytes[6];
        this.ExpressionVariant = bytes[7];
        this.Size = bytes.length;

        //Specialized object
        if (this.GeneType == 0) {
            //Brain
            if (this.GeneSubType == 0) {
                //Brain Lobe
                this.SpecialiazedObj = new GeneBrainLobe(bytes.slice(8), this);
            } else if (this.GeneSubType == 1) {
                //Brain Organ
                this.SpecialiazedObj = new GeneOrgan(bytes.slice(8), this);
            } else if (this.GeneSubType == 2) {
                //Brain Tract
                this.SpecialiazedObj = new GeneBrainTract(bytes.slice(8), this);
            }
        } else if (this.GeneType == 1) {
            //Chemical
            if (this.GeneSubType == 0) {
                //Receptor
                this.SpecialiazedObj = new GeneBiochemistryReceptorEmitter(bytes.slice(8), this, 0);
            } else if (this.GeneSubType == 1) {
                //Emitter
                this.SpecialiazedObj = new GeneBiochemistryReceptorEmitter(bytes.slice(8), this, 1);
            } else if (this.GeneSubType == 2) {
                //Reaction
                this.SpecialiazedObj = new GeneBiochemistryReaction(bytes.slice(8), this);
            } else if (this.GeneSubType == 3) {
                //Half Lives
                this.SpecialiazedObj = new GeneBiochemistryHalfLives(bytes.slice(8), this);
            } else if (this.GeneSubType == 4) {
                //Initial Concentration
                this.SpecialiazedObj = new GeneBiochemistryInitialConcentration(bytes.slice(8), this);
            } else if (this.GeneSubType == 5) {
                //Neuro Emitter
                this.SpecialiazedObj = new GeneBiochemistryNeuroEmitter(bytes.slice(8), this);
            }
        } else if (this.GeneType == 2) {
            //Creature
            if (this.GeneSubType == 0) {
                //Stimulus
                this.SpecialiazedObj = new GeneCreatureStimulus(bytes.slice(8), this);
            } else if (this.GeneSubType == 1) {
                //Genus
                this.SpecialiazedObj = new GeneCreatureGenus(bytes.slice(8), this);
            } else if (this.GeneSubType == 2) {
                //Appearance
                this.SpecialiazedObj = new GeneCreatureAppearance(bytes.slice(8), this);
            } else if (this.GeneSubType == 3) {
                //Pose
                this.SpecialiazedObj = new GeneCreaturePose(bytes.slice(8), this);
            } else if (this.GeneSubType == 4) {
                //Gait
                this.SpecialiazedObj = new GeneCreatureGait(bytes.slice(8), this);
            } else if (this.GeneSubType == 5) {
                //Instinct
                this.SpecialiazedObj = new GeneCreatureInstinct(bytes.slice(8), this);
            } else if (this.GeneSubType == 6) {
                //Pigment
                this.SpecialiazedObj = new GeneCreaturePigment(bytes.slice(8), this);
            } else if (this.GeneSubType == 7) {
                //Pigment bleed
                this.SpecialiazedObj = new GeneCreaturePigmentBleed(bytes.slice(8), this);
            } else if (this.GeneSubType == 8) {
                //Facial Expression
                this.SpecialiazedObj = new GeneCreatureFacialExpression(bytes.slice(8), this);
            }
        } else if (this.GeneType == 3) {
            //Organ
            if (this.GeneSubType == 0) {
                //Organ
                this.SpecialiazedObj = new GeneOrgan(bytes.slice(8), this);
            }
        }
    }

    getBytes() {
        //Update flag fields
        this.writeFlags();
        var bytes = [intTo1Byte(this.GeneType), intTo1Byte(this.GeneSubType), intTo1Byte(this.GeneId), intTo1Byte(this.Generation), intTo1Byte(this.SwitchOnTime), intTo1Byte(this.Flags), intTo1Byte(this.MutabilityWeighting), intTo1Byte(this.Expression)];
        if (this.SpecialiazedObj) {
            bytes = mergeUint8Arrays(bytes, this.SpecialiazedObj.getBytes());
        }
        return bytes;
    }

    //Read flags based on the bits values
    readFlags() {
        this.Mutable = checkBitValue(this.Flags, 0);
        this.Duplicable = checkBitValue(this.Flags, 1);
        this.Deletable = checkBitValue(this.Flags, 2);
        this.MaleOnly = checkBitValue(this.Flags, 3);
        this.FemaleOnly = checkBitValue(this.Flags, 4);
        this.NotExpressed = checkBitValue(this.Flags, 5);
    }

    writeFlags() {
        this.Flags = 0;
        this.Flags = updateBit(this.Flags, 0, this.Mutable);
        this.Flags = updateBit(this.Flags, 1, this.Duplicable);
        this.Flags = updateBit(this.Flags, 2, this.Deletable);
        this.Flags = updateBit(this.Flags, 3, this.MaleOnly);
        this.Flags = updateBit(this.Flags, 4, this.FemaleOnly);
        this.Flags = updateBit(this.Flags, 5, this.NotExpressed);
    }

    typeString() {
        return GeneTypes_str[this.GeneType] + ">" + GeneSubTypes_str[this.GeneType][this.GeneSubType];
    }

    switchOnString() {
        return SwitchOn_str[this.SwitchOnTime];
    }

    sexString() {
        if (this.MaleOnly) {
            return "m";
        } else if (this.FemaleOnly) {
            return "f";
        }
        return "-";
    }

    descriptionString() {
        if (this.GeneNoteObj) {
            return this.GeneNoteObj.Caption;
        }
        return "";
    }

    setGeneNote(GeneNoteObj) {
        this.GeneNoteObj = GeneNoteObj;
    }

    toString() {
        return "Gene #" + this.EntryNumber + ": " + this.GeneId + " - (" + this.typeString() + ")";
    }
}

class SVcode {
    Opcode = null;
    Operand = null;
    Value = null;

    constructor(bytes) {
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Opcode = bytes[0];
        this.Operand = bytes[1];
        this.Value = bytes[2];
    }

    getBytes() {
        var bytes = new Uint8Array([intTo1Byte(this.Opcode), intTo1Byte(this.Operand), intTo1Byte(this.Value)]);
        return bytes;
    }

    setSVNote(SVNoteObj) {
        this.SVNoteObj = SVNoteObj;
    }
}

class SVRule {
    Codes = [];
    SVNoteObj = null;

    constructor(bytes) {
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        var cursor = 0;
        for (var i = 0; i < 16; i++) {
            this.Codes.push(new SVcode(bytes.slice(cursor, cursor + 3)));
            cursor += 3;
        }
    }

    getBytes() {
        var bytes = new Uint8Array([]);
        for (var i = 0; i < 16; i++) {
            bytes = mergeUint8Arrays(bytes, this.Codes[i].getBytes());
        }
        return bytes;
    }

    setSVNote(SVNoteObj) {
        this.SVNoteObj = SVNoteObj;
    }
}

class GeneBrainLobe {
    LobeId = null;
    UpdateTime = null;
    X = null;
    Y = null;
    Width = null;
    Height = null;
    Red = null;
    Green = null;
    Blue = null;
    WTA = null;
    Tissue = null;
    Spare = [];
    InitSVRule = null;
    UpdateSVRule = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.LobeId = String.fromCharCode.apply(null, bytes.slice(0, 4));
        this.UpdateTime = intFromBytesB(bytes.slice(4, 6));//Number in the update sequence
        this.X = intFromBytesB(bytes.slice(6, 8));
        this.Y = intFromBytesB(bytes.slice(8, 10));
        this.Width = bytes[10];
        this.Height = bytes[11];
        this.Red = bytes[12];
        this.Green = bytes[13];
        this.Blue = bytes[14];
        this.WTA = bytes[15]; //Winner take all?
        this.Tissue = bytes[16];
        this.Spare = bytes.slice(17, 25); //0: Initialization rule runs always
        this.InitSVRule = new SVRule(bytes.slice(25, 73));
        this.UpdateSVRule = new SVRule(bytes.slice(73, 121));
    }

    getBytes() {
       var bytes = new Uint8Array([]);
       bytes = mergeUint8Arrays(bytes, string2Bin(this.LobeId));
       bytes = mergeUint8Arrays(bytes, toBigEndian(intTo2Bytes(this.UpdateTime)));
       bytes = mergeUint8Arrays(bytes,toBigEndian(intTo2Bytes(this.X)));
       bytes = mergeUint8Arrays(bytes, toBigEndian(intTo2Bytes(this.Y)));
       bytes = mergeUint8Arrays(bytes, [intTo1Byte(this.Width), intTo1Byte(this.Height), intTo1Byte(this.Red), intTo1Byte(this.Green), intTo1Byte(this.Blue), intTo1Byte(this.WTA), intTo1Byte(this.Tissue)]);
       bytes = mergeUint8Arrays(bytes, this.Spare);
       bytes = mergeUint8Arrays(bytes, this.InitSVRule.getBytes());
       bytes = mergeUint8Arrays(bytes, this.UpdateSVRule.getBytes());
       return bytes;
    }

    setSVNote(SVNoteObj) {
        if (SVNoteObj.RuleNumber == 0) {
            //Init rule
            this.InitSVRule.setSVNote(SVNoteObj);
        } else if (SVNoteObj.RuleNumber == 1) {
            //Update rule
            this.UpdateSVRule.setSVNote(SVNoteObj);
        }
    }

    getNeuronsCount() {
        if (this.Width != null && this.Height != null) {
            return this.Width * this.Height;
        }
        return 0;
    }
}

class GeneOrgan {
    ClockRate = null;
    RepairRate = null;
    LifeForce = null;
    BioTickStart = null;
    ATPDamageCoEff = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;

        this.ClockRate = bytes[0];
        this.RepairRate = bytes[1];
        this.LifeForce = bytes[2];
        this.BioTickStart = bytes[3];
        this.ATPDamageCoEff = bytes[4];
    }

    getBytes() {
        var bytes = new Uint8Array([this.ClockRate, this.RepairRate, this.LifeForce, this.BioTickStart, this.ATPDamageCoEff]);
        return bytes;
    }
}

class GeneBrainTract {
    UpdateTime = null;
    SourceLobeId = null;
    SourceLobeLowerBound = null;
    SourceLobeUpperBound = null;
    SourceNBConnections = 0;
    DestinationLobeId = null;
    DestinationLobeLowerBound = null;
    DestinationLobeUpperBound = null;
    DestinationNBConnections = 0;
    UseRandom = false;
    NoConnectionsIsRandom = false;
    Spare = [];
    InitSVRule = null;
    UpdateSVRule = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.UpdateTime = intFromBytesB(bytes.slice(0, 2));//Number in the update sequence
        this.SourceLobeId = String.fromCharCode.apply(null, bytes.slice(2, 6));
        this.SourceLobeLowerBound = intFromBytesB(bytes.slice(6, 8));
        this.SourceLobeUpperBound = intFromBytesB(bytes.slice(8, 10));
        this.SourceNBConnections = intFromBytesB(bytes.slice(10, 12));
        this.DestinationLobeId = String.fromCharCode.apply(null, bytes.slice(12, 16));
        this.DestinationLobeLowerBound = intFromBytesB(bytes.slice(16, 18));
        this.DestinationLobeUpperBound = intFromBytesB(bytes.slice(18, 20));
        this.DestinationNBConnections = intFromBytesB(bytes.slice(20, 22));
        this.UseRandom = bytes[22];
        this.NoConnectionsIsRandom = bytes[23];
        this.Spare = bytes.slice(24, 32);
        this.InitSVRule = new SVRule(bytes.slice(32, 80));
        this.UpdateSVRule = new SVRule(bytes.slice(80, 128));
    }

    getBytes() {
        var bytes = new Uint8Array([]);
        bytes = mergeUint8Arrays(bytes, toBigEndian(intTo2Bytes(this.UpdateTime)));
        bytes = mergeUint8Arrays(bytes, string2Bin(this.SourceLobeId));
        bytes = mergeUint8Arrays(bytes,toBigEndian(intTo2Bytes(this.SourceLobeLowerBound)));
        bytes = mergeUint8Arrays(bytes, toBigEndian(intTo2Bytes(this.SourceLobeUpperBound)));
        bytes = mergeUint8Arrays(bytes, toBigEndian(intTo2Bytes(this.SourceNBConnections)));
        bytes = mergeUint8Arrays(bytes, string2Bin(this.DestinationLobeId));
        bytes = mergeUint8Arrays(bytes,toBigEndian(intTo2Bytes(this.DestinationLobeLowerBound)));
        bytes = mergeUint8Arrays(bytes, toBigEndian(intTo2Bytes(this.DestinationLobeUpperBound)));
        bytes = mergeUint8Arrays(bytes, toBigEndian(intTo2Bytes(this.DestinationNBConnections)));
        bytes = mergeUint8Arrays(bytes, [intTo1Byte(this.UseRandom), intTo1Byte(this.NoConnectionsIsRandom)]);
        bytes = mergeUint8Arrays(bytes, this.Spare);
        bytes = mergeUint8Arrays(bytes, this.InitSVRule.getBytes());
        bytes = mergeUint8Arrays(bytes, this.UpdateSVRule.getBytes());
        return bytes;
    }

    setSVNote(SVNoteObj) {
        if (SVNoteObj.RuleNumber == 0) {
            //Init rule
            this.InitSVRule.setSVNote(SVNoteObj);
        } else if (SVNoteObj.RuleNumber == 1) {
            //Update rule
            this.UpdateSVRule.setSVNote(SVNoteObj);
        }
    }

    getPathString() {
        if (this.SourceLobeId != null && this.DestinationLobeId != null) {
           return  this.SourceLobeId + "->" + this.DestinationLobeId;
        }
        return "Unknown";
    }
}

class GeneBiochemistryReceptorEmitter {

    type = 0; //0=Receptor, 1=Emitter

    Organ = null;
    Tissue = null;
    Locus = null;
    Chemical = null;
    Threshold = null;
    Nominal = null;
    Gain = null;
    Flags = null; //1=Inverted; 2=Digital (Output = Nominal ± Gain If Signal>Threshold)
    Inverted = false;
    Digital = false;
    ClearSource = false;

    ParentObj = null;

    constructor(bytes, parent_obj, type) {
        this.type = type;
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Organ = bytes[0];
        this.Tissue = bytes[1];
        this.Locus = bytes[2];
        this.Chemical = bytes[3];
        this.Threshold = bytes[4];
        this.Nominal = bytes[5];
        this.Gain = bytes[6];
        this.Flags = bytes[7];
        this.readFlags();
    }

    getBytes() {
        this.writeFlags();
        var bytes = new Uint8Array([this.Organ, this.Tissue, this.Locus, this.Chemical, this.Threshold, this.Nominal, this.Gain, this.Flags]);
        return bytes;
    }

    //Read flags based on the bits values
    readFlags() {
        this.Inverted = checkBitValue(this.Flags, 0);
        this.Digital = checkBitValue(this.Flags, 1);
        if (this.type == 1) {
            this.ClearSource = checkBitValue(this.Flags, 2);
        }
    }

    writeFlags() {
        this.Flags = 0;
        this.Flags = updateBit(this.Flags, 0, this.Inverted);
        this.Flags = updateBit(this.Flags, 1, this.Digital);
        if (this.type == 1) {
            this.Flags = updateBit(this.Flags, 2, this.ClearSource);
        }
    }
}

class GeneBiochemistryReaction {
    Reactant0 = null;
    Quantity0 = null;
    Reactant1 = null;
    Quantity1 = null;
    Product2 = null;
    Quantity2 = null;
    Product3 = null;
    Quantity3 = null;
    ReactionRate = 0; //The Reaction rate is such that 0=instant, 255=52 years

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Reactant0 = bytes[0];
        this.Quantity0 = bytes[1];
        this.Reactant1 = bytes[2];
        this.Quantity1 = bytes[3];
        this.Product2 = bytes[4];
        this.Quantity2 = bytes[5];
        this.Product3 = bytes[6];
        this.Quantity3 = bytes[7];
        this.ReactionRate = bytes[8];
    }

    getBytes() {
        var bytes = new Uint8Array([this.Reactant0, this.Quantity0, this.Reactant1, this.Quantity1, this.Product2, this.Quantity2, this.Product3, this.Quantity3, this.ReactionRate]);
        return bytes;
    }
}

class GeneBiochemistryHalfLives {
    HalfLife = []; //These are the decay rates of all of the chemicals within the creature's Biochemical Sea. They are arranged in the same way as the reaction rate.

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        for (var i=0; i<256; i++)
        {
            this.HalfLife.push(bytes[i]);
        }
    }

    getBytes() {
        return new Uint8Array(this.HalfLife);
    }
}

class GeneBiochemistryInitialConcentration {
    Chemical = null;
    Amount = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Chemical = bytes[0];
        this.Amount = bytes[1];
    }

    getBytes() {
        return new Uint8Array([this.Chemical, this.Amount]);
    }
}

class GeneBiochemistryNeuroEmitter {
    Lobe1 = null;
    Neuron1 = null;
    Lobe2 = null;
    Neuron2 = null;
    Lobe3 = null;
    Neuron3 = null;

    SampleRate = 0;

    Chemical1 = 0;
    Amount1 = 0;
    Chemical2 = 0;
    Amount2 = 0;
    Chemical3 = 0;
    Amount3 = 0;
    Chemical4 = 0;
    Amount4 = 0;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Lobe1 = bytes[0];
        this.Neuron1 = bytes[1];
        this.Lobe2 = bytes[2];
        this.Neuron2 = bytes[3];
        this.Lobe3 = bytes[4];
        this.Neuron3 = bytes[5];
        this.SampleRate = bytes[6];
        this.Chemical1 = bytes[7];
        this.Amount1 = bytes[8];
        this.Chemical2 = bytes[9];
        this.Amount2 = bytes[10];
        this.Chemical3 = bytes[11];
        this.Amount3 = bytes[12];
        this.Chemical4 = bytes[13];
        this.Amount4 = bytes[14];
    }

    getBytes() {
        return new Uint8Array([
            this.Lobe1,
            this.Neuron1,
            this.Lobe2,
            this.Neuron2,
            this.Lobe3,
            this.Neuron3,
            this.SampleRate,
            this.Chemical1,
            this.Amount1,
            this.Chemical2,
            this.Amount2,
            this.Chemical3,
            this.Amount3,
            this.Chemical4,
            this.Amount4
        ]);
    }
}

class GeneCreatureStimulus {
    StimulusNumber = null;
    Significance = null;
    SensoryNeuron = null;
    Features = null;
    Drive0 = null;
    Amount0 = null;
    Silent0 = false;
    Drive1 = null;
    Amount1 = null;
    Silent1 = false;
    Drive2 = null;
    Amount2 = null;
    Silent2 = false;
    Drive3 = null;
    Amount3 = null;
    Silent3 = false;
    Flags = 0;
    Modulate = false;
    Detected = false;
    Spare = 0;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.StimulusNumber = bytes[0];
        this.Significance = bytes[1];
        this.SensoryNeuron = bytes[2];
        this.Features = bytes[3];
        this.Flags = bytes[4]; //Undocumented
        this.Drive0 = bytes[5];
        this.Amount0 = bytes[6];
        this.Drive1 = bytes[7];
        this.Amount1 = bytes[8];
        this.Drive2 = bytes[9];
        this.Amount2 = bytes[10];
        this.Drive3 = bytes[11];
        this.Spare = bytes[12];
        this.readFlags();
    }

    getBytes() {
        this.writeFlags();
        return new Uint8Array([
            this.StimulusNumber,
            this.Significance,
            this.SensoryNeuron,
            this.Features,
            this.Drive0,
            this.Amount0,
            this.Drive1,
            this.Amount1,
            this.Drive2,
            this.Amount2,
            this.Drive3,
            this.Amount3,
            this.Spare
        ]);
    }

    //Read flags based on the bits values
    readFlags() {
        //Don't know what the other flags are doing...#0 and #3
        this.Modulate = checkBitValue(this.Flags, 1);
        this.Detected = checkBitValue(this.Flags, 2);
        this.Silent0 = checkBitValue(this.Flags, 4);
        this.Silent1 = checkBitValue(this.Flags, 5);
        this.Silent2 = checkBitValue(this.Flags, 6);
        this.Silent3 = checkBitValue(this.Flags, 7);
        /*console.log("#"+this.ParentObj.EntryNumber+" | "+this.Flags);
        var f1 = checkBitValue(this.Flags, 0);
        console.log("f1:"+f1);
        var f2 = checkBitValue(this.Flags, 1);
        console.log("f2:"+f2);
        var f3 = checkBitValue(this.Flags, 2);
        console.log("f3:"+f3);
        var f4 = checkBitValue(this.Flags, 3);
        console.log("f4:"+f4);
        var f5 = checkBitValue(this.Flags, 4);
        console.log("f5:"+f5);
        var f6 = checkBitValue(this.Flags, 5);
        console.log("f6:"+f6);
        var f7 = checkBitValue(this.Flags, 6);
        console.log("f7:"+f7);
        var f8 = checkBitValue(this.Flags, 7);
        console.log("f8:"+f8);*/
    }

    writeFlags() {
        this.Flags = 0;
        this.Flags = updateBit(this.Flags, 1, this.Modulate);
        this.Flags = updateBit(this.Flags, 2, this.Detected);
        this.Flags = updateBit(this.Flags, 4, this.Silent0);
        this.Flags = updateBit(this.Flags, 5, this.Silent1);
        this.Flags = updateBit(this.Flags, 6, this.Silent2);
        this.Flags = updateBit(this.Flags, 7, this.Silent3);
    }
}

class GeneCreatureGenus {
    Genus = null;
    MumMoniker = null;
    DadMoniker = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Genus = bytes[0];
        this.MumMoniker = String.fromCharCode.apply(null, bytes.slice(1, 33));
        this.DadMoniker = String.fromCharCode.apply(null, bytes.slice(33, 65));
    }

    getBytes() {
        var bytes = new Uint8Array([this.Genus]);
        bytes = mergeUint8Arrays(bytes, fixedLengtharray(string2Bin(this.MumMoniker), 32));
        bytes = mergeUint8Arrays(bytes, fixedLengtharray(string2Bin(this.DadMoniker), 32));

        return bytes;
    }
}

class GeneCreatureAppearance {
    BodyPart = null;
    Variant = null;
    GenusOfDonor = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.BodyPart = bytes[0];
        this.Variant = bytes[1];
        this.GenusOfDonor = bytes[2];
    }

    getBytes() {
        return new Uint8Array([this.BodyPart, this.Variant, this.GenusOfDonor]);
    }
}

class GeneCreaturePose {
    PoseNumber = null;
    PoseString = "";

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.PoseNumber = bytes[0];
        this.PoseString = String.fromCharCode.apply(null, bytes.slice(1, 17));
    }

    getBytes() {
        var bytes = new Uint8Array([this.PoseNumber]);
        bytes = mergeUint8Arrays(bytes, fixedLengtharray(string2Bin(this.PoseString), 16));

        return bytes;
    }
}

class GeneCreatureGait {
    GaitNumber = null;
    PoseSequence = [];

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.GaitNumber = bytes[0];
        this.PoseSequence = bytes.slice(1, 9);
    }

    getBytes() {
        var bytes = new Uint8Array([this.GaitNumber]);
        bytes = mergeUint8Arrays(bytes, fixedLengtharray(this.PoseSequence, 8));

        return bytes;
    }
}

class GeneCreatureInstinct {
    Lobe0 = null;
    Neuron0 = null;
    Lobe1 = null;
    Neuron1 = null;
    Lobe2 = null;
    Neuron2 = null;
    Action = null;
    ReinforcementDrive = null;
    ReinforcementLevel = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Lobe0 = bytes[0];
        this.Neuron0 = bytes[1];
        this.Lobe1 = bytes[2];
        this.Neuron1 = bytes[3];
        this.Lobe2 = bytes[4];
        this.Neuron2 = bytes[5];
        this.Action = bytes[6];
        this.ReinforcementDrive = bytes[7];
        this.ReinforcementLevel = bytes[8];
    }

    getBytes() {
        return new Uint8Array([this.Lobe0, this.Neuron0, this.Lobe1, this.Neuron1, this.Lobe2, this.Neuron2, this.Action, this.ReinforcementDrive, this.ReinforcementLevel]);

        return bytes;
    }
}

class GeneCreaturePigment {
    PigmentColour = null;
    AmountOfColour = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.PigmentColour = bytes[0];
        this.AmountOfColour = bytes[1];
    }

    getBytes() {
        return new Uint8Array([this.PigmentColour, this.AmountOfColour]);

        return bytes;
    }
}

class GeneCreaturePigmentBleed {
    Rotation = null;
    Swap = null;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Rotation = bytes[0];
        this.Swap = bytes[1];
    }

    getBytes() {
        return new Uint8Array([this.Rotation, this.Swap]);

        return bytes;
    }
}

class GeneCreatureFacialExpression {
    Expression = null;
    Weight = null;
    Drive0 = null;
    Amount0 = null;
    Drive1 = null;
    Amount1 = null;
    Drive2 = null;
    Amount2 = null;
    Drive3 = null;
    Amount3 = null;
    Spare = 0;

    ParentObj = null;

    constructor(bytes, parent_obj) {
        this.ParentObj = parent_obj;
        this.readFromBytes(bytes);
    }

    readFromBytes(bytes) {
        this.Expression = bytes[0];
        this.Spare = bytes[1];
        this.Weight = bytes[2];
        this.Drive0 = bytes[3];
        this.Amount0 = bytes[4];
        this.Drive1 = bytes[5];
        this.Amount1 = bytes[6];
        this.Drive2 = bytes[7];
        this.Amount2 = bytes[8];
        this.Drive3 = bytes[9];
        this.Amount3 = bytes[10];
    }

    getBytes() {
        return new Uint8Array([this.Expression, this.Spare, this.Weight, this.Drive0, this.Amount0, this.Drive1, this.Amount1, this.Drive2, this.Amount2,, this.Drive3, this.Amount3]);

        return bytes;
    }
}

class SVNote {
    GeneType = null;
    GeneSubType = null;
    UniqueId = null;
    RuleNumber = null;
    Annotations = [16];
    GeneralNotes = "";

    constructor(bytes) {
        if (bytes) {
            this.readFromBytes(bytes);
        }
    }

    readFromBytes(bytes) {
        this.GeneType = intFromBytes(bytes.slice(0, 2));
        this.GeneSubType = intFromBytes(bytes.slice(2, 4));
        this.UniqueId = intFromBytes(bytes.slice(4, 6));
        this.RuleNumber = intFromBytes(bytes.slice(6, 8));
        var dummy = intFromBytes(bytes.slice(8, 10));
        if (dummy != 0) {
            console.log("ERROR: V1=" + dummy);
        }
        var cursor = 10;
        for (var i = 0; i < 16; i++) {
            var len = intFromBytes(bytes.slice(cursor, cursor + 2));
            cursor += 2;
            this.Annotations.push(String.fromCharCode.apply(null, bytes.slice(cursor, cursor + len)));
            cursor += len;
            if (len > 0) {
                console.log("AN(" + len + "):" + this.Annotations[this.Annotations.length - 1]);
            }
        }
        dummy = intFromBytes(bytes.slice(cursor, cursor + 2));
        cursor += 2;
        if (dummy != 0) {
            console.log("ERROR: V2=" + dummy);
        }
        len = intFromBytes(bytes.slice(cursor, cursor + 2));
        cursor += 2;
        this.GeneralNotes = String.fromCharCode.apply(null, bytes.slice(cursor, cursor + len));
        cursor += len;
        /*if (len>0) {
                console.log("GN("+len+"):" + this.GeneralNotes);
            }*/
        if (this.GeneralNotes.includes("Keep balance between vi")) {
            console.log("ERROR: " + len);
        }
    }

    dumpBytes(bytes) {
        var output_string = "";
        for (var i = 0; i < bytes.length; i += 2) {
            output_string += i + ": " + intFromBytes(bytes.slice(i, i + 1)) + ", ";
        }

        return output_string;
    }
}

class GeneNote {
    GeneType = null;
    GeneSubType = null;
    UniqueId = null;
    Caption = "";
    RichText = "";

    constructor(bytes) {
        if (bytes) {
            this.readFromBytes(bytes);
        }
    }

    readFromBytes(bytes) {
        this.GeneType = intFromBytes(bytes.slice(0, 2));
        this.GeneSubType = intFromBytes(bytes.slice(2, 4));
        this.UniqueId = intFromBytes(bytes.slice(4, 6));
        var cursor = 8;
        var len = intFromBytes(bytes.slice(cursor, cursor + 2));
        cursor += 2;
        this.Caption = String.fromCharCode.apply(null, bytes.slice(cursor, cursor + len));
        cursor += len;
        /*   if (len>0) {
               console.log("GN Caption("+len+"):" + this.GeneType + "|" + this.GeneSubType + "|" + this.UniqueId + "|" + this.Caption);
           }*/
        len = intFromBytes(bytes.slice(cursor, cursor + 2));
        cursor += 2;
        this.RichText = String.fromCharCode.apply(null, bytes.slice(cursor, cursor + len));
        /*if (len>0) {
                console.log("GN RichText("+len+"):" + this.GeneType + "|" + this.GeneSubType + "|" + this.UniqueId + "|" + this.Caption);
            }*/
    }

    getBytes() {

    }
}