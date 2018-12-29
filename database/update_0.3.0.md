# 0.3.0 Update
1. Update task status:
```
db.bp_tasks.updateMany({
    status: null
}, { $set: { status : 1 } });
```

2. Update union task status:
```
db.bp_uniontasks.updateMany({
    status: null
}, { $set: { status : 1 } });
```