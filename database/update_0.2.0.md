# 0.2.0 Update
1. Close task flow without status:
```
db.bp_taskflows.updateMany({
    status: null
}, { $set: { status : -2 } });
```